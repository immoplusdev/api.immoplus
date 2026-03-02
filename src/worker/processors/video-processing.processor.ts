import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { DataSource } from "typeorm";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as sharp from "sharp";
import * as ffmpeg from "fluent-ffmpeg";
import { Deps } from "@/core/domain/common/ioc";
import { FeedVideoStatus } from "@/core/domain/feed";
import { FeedVideoEntity } from "@/infrastructure/features/feed/feed-video.entity";
import { VideoViewEventEntity } from "@/infrastructure/features/feed/video-view-event.entity";
import {
  QUEUE_VIDEO_PROCESSING,
  QUEUE_VIEW_EVENTS,
  JOB_PROCESS_VIDEO,
  JOB_AGGREGATE_VIEWS,
} from "@/infrastructure/features/feed/queue/feed-queue.constants";

interface ProcessVideoJobData {
  feedVideoId: string;
  videoS3Key: string;
}

interface AggregateViewsJobData {
  videoId: string;
  userId: string;
  watchDurationMs: number;
  viewedAt: string;
}

@Processor(QUEUE_VIDEO_PROCESSING)
export class VideoProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessingProcessor.name);

  constructor(
    @Inject(Deps.DataSource) private readonly dataSource: DataSource,
    @Inject("S3_INJECT_TOKEN") private readonly s3: S3Client,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === JOB_PROCESS_VIDEO) {
      await this.processVideo(job as Job<ProcessVideoJobData>);
    }
  }

  private async processVideo(job: Job<ProcessVideoJobData>): Promise<void> {
    const { feedVideoId, videoS3Key } = job.data;
    const repo = this.dataSource.getRepository(FeedVideoEntity);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "feedvideo-"));
    const videoPath = path.join(tmpDir, "input.mp4");
    const framePath = path.join(tmpDir, "frame.png");
    const thumbPath = path.join(tmpDir, "thumbnail.webp");

    try {
      this.logger.log(`Processing video ${feedVideoId}`);

      // 1. Download video from S3
      const bucket = process.env.AWS_S3_BUCKET_NAME ?? "files";
      const getCmd = new GetObjectCommand({ Bucket: bucket, Key: videoS3Key });
      const s3Response = await this.s3.send(getCmd);
      const body = s3Response.Body as NodeJS.ReadableStream;
      await new Promise<void>((resolve, reject) => {
        const ws = fs.createWriteStream(videoPath);
        body.pipe(ws);
        ws.on("finish", resolve);
        ws.on("error", reject);
      });

      // 2. Extract frame at 1 second with ffmpeg
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .seekInput(1)
          .frames(1)
          .output(framePath)
          .on("end", () => resolve())
          .on("error", (err: Error) => reject(err))
          .run();
      });

      // 3. Get video metadata (duration, dimensions)
      const metadata = await this.getVideoMetadata(videoPath);

      // 4. Optimize frame → WebP with sharp
      await sharp(framePath)
        .resize(480, 854, { fit: "cover" })
        .webp({ quality: 78 })
        .toFile(thumbPath);

      // 5. Upload thumbnail to S3
      const thumbnailKey = `thumbnails/${randomUUID()}.webp`;
      const thumbBuffer = fs.readFileSync(thumbPath);
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: thumbnailKey,
          Body: thumbBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
      const thumbnailUrl = `${baseUrl}/files/raw/public/${thumbnailKey}`;

      // 6. Update feed_videos record
      await repo.update(feedVideoId, {
        status: FeedVideoStatus.Ready,
        thumbnailUrl,
        durationMs: metadata.durationMs,
        width: metadata.width,
        height: metadata.height,
      });

      this.logger.log(`Video ${feedVideoId} processed successfully`);
    } catch (err) {
      this.logger.error(`Failed to process video ${feedVideoId}`, err);
      await repo.update(feedVideoId, { status: FeedVideoStatus.Failed });
      throw err; // let BullMQ retry
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  private getVideoMetadata(
    filePath: string,
  ): Promise<{ durationMs: number; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, meta) => {
        if (err) return reject(err);
        const stream = meta.streams.find((s) => s.codec_type === "video");
        const durationMs = Math.round((meta.format.duration ?? 0) * 1000);
        resolve({
          durationMs,
          width: stream?.width ?? 0,
          height: stream?.height ?? 0,
        });
      });
    });
  }
}

@Processor(QUEUE_VIEW_EVENTS)
export class ViewEventsProcessor extends WorkerHost {
  constructor(
    @Inject(Deps.DataSource) private readonly dataSource: DataSource,
  ) {
    super();
  }

  async process(job: Job<AggregateViewsJobData>): Promise<void> {
    if (job.name !== JOB_AGGREGATE_VIEWS) return;

    const { videoId, userId, watchDurationMs, viewedAt } = job.data;
    const videoRepo = this.dataSource.getRepository(FeedVideoEntity);
    const viewRepo = this.dataSource.getRepository(VideoViewEventEntity);

    // Increment denormalized view_count
    await videoRepo
      .createQueryBuilder()
      .update()
      .set({ viewCount: () => "view_count + 1" })
      .where("id = :id", { id: videoId })
      .execute();

    // Store raw event for analytics
    await viewRepo.save(
      viewRepo.create({
        id: randomUUID(),
        videoId,
        userId,
        watchDurationMs,
        viewedAt: new Date(viewedAt),
      }),
    );
  }
}
