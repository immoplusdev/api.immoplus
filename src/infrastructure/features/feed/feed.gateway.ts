import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Inject, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Server, Socket } from "socket.io";
import { Queue } from "bullmq";
import { DataSource } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Deps } from "@/core/domain/common/ioc";
import { IVideoLikeRepository } from "@/core/domain/feed";
import { FeedVideoEntity } from "./feed-video.entity";
import { VideoLikeEntity } from "./video-like.entity";
import {
  QUEUE_VIEW_EVENTS,
  JOB_AGGREGATE_VIEWS,
} from "./queue/feed-queue.constants";

interface VideoViewPayload {
  video_id: string;
  watch_duration_ms: number;
}

interface VideoLikePayload {
  video_id: string;
}

@WebSocketGateway({ namespace: "/feed", cors: { origin: "*" } })
export class FeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(FeedGateway.name);

  // In-memory dedup per socket: Set<`${userId}:${videoId}`>
  private readonly viewedInSession = new Map<string, Set<string>>();

  constructor(
    @Inject(Deps.VideoLikeRepository)
    private readonly videoLikeRepository: IVideoLikeRepository,
    @Inject(Deps.DataSource)
    private readonly dataSource: DataSource,
    @InjectQueue(QUEUE_VIEW_EVENTS)
    private readonly viewQueue: Queue,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Connection ───────────────────────────────────────────────────────────

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.headers?.authorization as string)?.replace(
          "Bearer ",
          "",
        );

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub ?? payload.id ?? payload.userId;
      this.viewedInSession.set(client.id, new Set());
      this.logger.log(
        `Client connected: ${client.id} (user=${client.data.userId})`,
      );
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.viewedInSession.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── Room management ──────────────────────────────────────────────────────

  @SubscribeMessage("video:enter")
  handleEnter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { video_id: string },
  ) {
    client.join(`video:${data.video_id}`);
  }

  @SubscribeMessage("video:leave")
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { video_id: string },
  ) {
    client.leave(`video:${data.video_id}`);
  }

  // ─── View tracking ────────────────────────────────────────────────────────

  @SubscribeMessage("video:view")
  async handleView(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: VideoViewPayload,
  ) {
    const userId = client.data.userId as string;
    if (!userId || !data.video_id) return;

    const dedupeKey = `${userId}:${data.video_id}`;
    const sessionViews = this.viewedInSession.get(client.id);

    if (sessionViews?.has(dedupeKey)) return; // already viewed in this session
    sessionViews?.add(dedupeKey);

    await this.viewQueue.add(
      JOB_AGGREGATE_VIEWS,
      {
        videoId: data.video_id,
        userId,
        watchDurationMs: data.watch_duration_ms ?? 0,
        viewedAt: new Date().toISOString(),
      },
      { removeOnComplete: true },
    );
  }

  // ─── Like toggle ──────────────────────────────────────────────────────────

  @SubscribeMessage("video:like")
  async handleLike(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: VideoLikePayload,
  ) {
    const userId = client.data.userId as string;
    if (!userId || !data.video_id) return;

    const { videoId, liked, likesCount } = await this.toggleLike(
      userId,
      data.video_id,
    );

    // Broadcast to all clients watching this video
    this.server.to(`video:${videoId}`).emit("video:likes_updated", {
      video_id: videoId,
      likes_count: likesCount,
      liked,
    });

    // Acknowledge to the sender
    return { liked, likes_count: likesCount };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async toggleLike(
    userId: string,
    videoId: string,
  ): Promise<{ videoId: string; liked: boolean; likesCount: number }> {
    const repo = this.dataSource.getRepository(VideoLikeEntity);
    const videoRepo = this.dataSource.getRepository(FeedVideoEntity);

    const existing = await this.videoLikeRepository.findByVideoAndUser(
      videoId,
      userId,
    );

    if (existing) {
      // Unlike
      await repo.delete({ videoId, userId });
      await videoRepo
        .createQueryBuilder()
        .update()
        .set({ likesCount: () => "GREATEST(0, likes_count - 1)" })
        .where("id = :id", { id: videoId })
        .execute();
    } else {
      // Like
      await repo.save(repo.create({ videoId, userId }));
      await videoRepo
        .createQueryBuilder()
        .update()
        .set({ likesCount: () => "likes_count + 1" })
        .where("id = :id", { id: videoId })
        .execute();
    }

    const updated = await videoRepo.findOne({ where: { id: videoId } });
    return {
      videoId,
      liked: !existing,
      likesCount: updated?.likesCount ?? 0,
    };
  }
}
