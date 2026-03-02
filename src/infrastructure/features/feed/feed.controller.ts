import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CommandBus } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { randomUUID } from "crypto";
import { CurrentUser } from "@/infrastructure/decorators";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { Deps } from "@/core/domain/common/ioc";
import {
  FeedParentType,
  FeedVideo,
  FeedVideoStatus,
  IFeedVideoRepository,
} from "@/core/domain/feed";
import { IFurnitureRepository } from "@/core/domain/furniture";
import { IResidenceRepository } from "@/core/domain/residences";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IUserRepository } from "@/core/domain/users";
import {
  CreateFeedVideoCommand,
  UploadFeedVideoCommand,
} from "@/core/application/feed";
import { UploadFileCommand } from "@/core/application/files";
import { MulterFile } from "@/infrastructure/features/files/dto";
import { FilesService } from "@/infrastructure/features/files/file-service";
import {
  CreateFeedVideoDto,
  FeedCursorQueryDto,
  FeedItemDto,
  UploadFeedVideoDto,
  WrapperResponseFeedBatchDto,
  decodeCursor,
  encodeCursor,
} from "./dto";
import { FeedEngagementService } from "./feed-engagement.service";
import { FeedVideoEntity } from "./feed-video.entity";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";

@ApiTags("Feed")
@Controller("feed")
export class FeedController {
  constructor(
    @Inject(Deps.FeedVideoRepository)
    private readonly feedVideoRepository: IFeedVideoRepository,
    @Inject(Deps.FurnitureRepository)
    private readonly furnitureRepository: IFurnitureRepository,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly bienImmobilierRepository: IBienImmobilierRepository,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.FileService)
    private readonly filesService: FilesService,
    @Inject(Deps.DataSource)
    private readonly dataSource: DataSource,
    private readonly feedEngagementService: FeedEngagementService,
    private readonly commandBus: CommandBus,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private buildVideoUrl(fileId: string): string {
    const BASE_URL = process.env.APP_URL ?? "http://localhost:3000";
    return `${BASE_URL}/files/videos/raw/public/${fileId}`;
  }

  private buildAvatarUrl(fileId?: string): string | undefined {
    if (!fileId) return undefined;
    const BASE_URL = process.env.APP_URL ?? "http://localhost:3000";
    return `${BASE_URL}/files/raw/public/${fileId}`;
  }

  private formatPrice(prix?: number): string | undefined {
    return prix != null ? `${prix.toLocaleString("fr-FR")} FCFA` : undefined;
  }

  // ─── POST /feed/videos ─────────────────────────────────────────────────────

  @Post("videos")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: "Lier une video existante a un bien" })
  async createFeedVideo(
    @Body() payload: CreateFeedVideoDto,
    @CurrentUser("id") userId: string,
  ) {
    const result = await this.commandBus.execute(
      new CreateFeedVideoCommand({ ...payload, createdBy: userId }),
    );
    return { data: result };
  }

  // ─── POST /feed/videos/upload ──────────────────────────────────────────────

  @Post("videos/upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file", "parentType", "parentId"],
      properties: {
        file: { type: "string", format: "binary" },
        parentType: { type: "string", enum: Object.values(FeedParentType) },
        parentId: { type: "string", format: "uuid" },
        titre: { type: "string" },
        description: { type: "string" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFeedVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadFeedVideoDto,
    @CurrentUser("id") userId: string,
  ) {
    const ext = file.originalname.split(".").pop() ?? "mp4";
    const s3Key = `videos/${randomUUID()}.${ext}`;

    const multerFile: MulterFile = { ...file, externalFileId: s3Key };

    // 1. Upload raw video to S3
    await this.filesService.uploadFile(multerFile);

    // 2. Save file record in files table
    const fileRecord = await this.commandBus.execute(
      new UploadFileCommand({
        userId,
        file: file as never,
        externalFileId: s3Key,
        folder: "videos",
      }),
    );

    // 3. Create feed_videos entry (status=processing) + push BullMQ job
    const feedVideo: FeedVideo = await this.commandBus.execute(
      new UploadFeedVideoCommand({
        videoFileId: fileRecord.id,
        videoS3Key: s3Key,
        parentType: payload.parentType,
        parentId: payload.parentId,
        titre: payload.titre,
        description: payload.description,
        createdBy: userId,
      }),
    );

    return {
      data: {
        id: feedVideo.id,
        status: feedVideo.status,
        message:
          "Vidéo en cours de traitement. Statut disponible via GET /feed/videos/:id",
      },
    };
  }

  // ─── GET /feed/videos/:id ──────────────────────────────────────────────────

  @Get("videos/:id")
  @ApiResponse({ description: "Détail d'une vidéo feed" })
  async getFeedVideoById(@Param("id") id: string) {
    const feedVideo = await this.feedVideoRepository.findOne(id);
    if (!feedVideo) throw new ItemNotFoundException();

    let author: { id: string; name: string; avatar?: string } | undefined;
    if (feedVideo.createdBy) {
      const user = await this.usersRepository.findOne(feedVideo.createdBy, {
        fields: ["id", "firstName", "lastName", "avatar"],
        relations: [],
        withDeleted: true,
      });
      if (user) {
        author = {
          id: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          avatar: this.buildAvatarUrl(user.avatar),
        };
      }
    }

    const likesMap = await this.feedEngagementService.getLikesMap([
      { itemId: feedVideo.id, source: "post", entity: feedVideo.parentType },
    ]);
    const likes =
      likesMap.get(
        this.feedEngagementService.makeKey({
          itemId: feedVideo.id,
          source: "post",
          entity: feedVideo.parentType,
        }),
      ) ?? 0;

    const item = new FeedItemDto({
      id: feedVideo.id,
      source: "post",
      videoUrl: this.buildVideoUrl(feedVideo.videoId),
      thumbnailUrl: feedVideo.thumbnailUrl,
      status: feedVideo.status,
      content: { title: feedVideo.titre, description: feedVideo.description },
      stats: { likes, views: feedVideo.viewCount ?? 0 },
      relatedTo: { entity: feedVideo.parentType, id: feedVideo.parentId },
      author,
      createdAt: feedVideo.createdAt,
    });
    return { data: item };
  }

  // ─── GET /feed (cursor-based pagination) ──────────────────────────────────

  @Get()
  @ApiResponse({ type: WrapperResponseFeedBatchDto })
  async getFeed(@Query() params: FeedCursorQueryDto) {
    const limit = Math.min(Number(params.limit ?? 10), 50);
    const propertyId = params.property_id;

    // 1. Cursor-based query on feed_videos (status = ready)
    const repo = this.dataSource.getRepository(FeedVideoEntity);
    const qb = repo
      .createQueryBuilder("fv")
      .where("fv.status = :status", { status: FeedVideoStatus.Ready });

    if (propertyId) {
      qb.andWhere("fv.parent_id = :propertyId", { propertyId });
    }

    if (params.cursor) {
      const { lastCreatedAt, lastId } = decodeCursor(params.cursor);
      qb.andWhere(
        "(fv.created_at < :lastCreatedAt OR (fv.created_at = :lastCreatedAt AND fv.id < :lastId))",
        { lastCreatedAt, lastId },
      );
    }

    qb.orderBy("fv.created_at", "DESC")
      .addOrderBy("fv.id", "DESC")
      .limit(limit + 1);

    const rawFeedVideos = await qb.getMany();
    const hasMore = rawFeedVideos.length > limit;
    const feedVideosPage = rawFeedVideos.slice(0, limit);

    // 2. Legacy items (only on first page, no property filter)
    let legacyItems: FeedItemDto[] = [];
    if (!params.cursor && !propertyId) {
      const [furnitures, residences, biens] = await Promise.all([
        this.furnitureRepository.findByQuery({ _per_page: 50 } as any),
        this.residenceRepository.findByQuery({ _per_page: 50 } as any),
        this.bienImmobilierRepository.findByQuery({ _per_page: 50 } as any),
      ]);

      legacyItems = [
        ...(furnitures.data ?? [])
          .filter((f) => f.video)
          .map(
            (f) =>
              new FeedItemDto({
                id: f.id,
                source: "legacy",
                videoUrl: this.buildVideoUrl(f.video),
                content: {
                  title: f.titre,
                  description: f.description,
                  price: this.formatPrice(f.prix),
                  location: f.adresse,
                },
                stats: { likes: 0, views: f.viewsCount ?? 0 },
                relatedTo: { entity: FeedParentType.Furniture, id: f.id },
                createdAt: f.createdAt,
              }),
          ),
        ...(residences.data ?? [])
          .filter((r) => r.video)
          .map(
            (r) =>
              new FeedItemDto({
                id: r.id,
                source: "legacy",
                videoUrl: this.buildVideoUrl(r.video),
                content: {
                  title: r.nom,
                  description: r.description,
                  price: this.formatPrice(r.prixReservation),
                  location: r.adresse,
                },
                stats: { likes: 0, views: 0 },
                relatedTo: { entity: FeedParentType.Residence, id: r.id },
                createdAt: r.createdAt,
              }),
          ),
        ...(biens.data ?? [])
          .filter((b) => b.video)
          .map(
            (b) =>
              new FeedItemDto({
                id: b.id,
                source: "legacy",
                videoUrl: this.buildVideoUrl(b.video),
                content: {
                  title: b.nom,
                  description: b.description,
                  price: this.formatPrice(b.prix),
                  location: b.adresse,
                },
                stats: { likes: 0, views: 0 },
                relatedTo: { entity: FeedParentType.BienImmobilier, id: b.id },
                createdAt: b.createdAt,
              }),
          ),
      ];
    }

    // 3. Resolve authors for feed_videos
    const authorIds = [
      ...new Set(
        feedVideosPage
          .map((fv) => fv.createdBy as unknown as string)
          .filter(Boolean),
      ),
    ];
    const authorMap = new Map<
      string,
      { id: string; name: string; avatar?: string }
    >();
    await Promise.all(
      authorIds.map(async (uid) => {
        const user = await this.usersRepository.findOne(uid, {
          fields: ["id", "firstName", "lastName", "avatar"],
          relations: [],
          withDeleted: true,
        });
        if (user) {
          authorMap.set(uid, {
            id: user.id,
            name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            avatar: this.buildAvatarUrl(user.avatar),
          });
        }
      }),
    );

    // 4. Map feed_videos to FeedItemDto
    const feedVideoItems: FeedItemDto[] = feedVideosPage.map(
      (fv) =>
        new FeedItemDto({
          id: fv.id,
          source: "post",
          videoUrl: this.buildVideoUrl(fv.videoId as unknown as string),
          thumbnailUrl: fv.thumbnailUrl,
          status: fv.status,
          content: { title: fv.titre, description: fv.description },
          stats: { likes: fv.likesCount ?? 0, views: fv.viewCount ?? 0 },
          relatedTo: { entity: fv.parentType, id: fv.parentId },
          author: fv.createdBy
            ? authorMap.get(fv.createdBy as unknown as string)
            : undefined,
          createdAt: fv.createdAt,
        }),
    );

    // 5. Merge engagement (real likes from DB)
    const likesMap = await this.feedEngagementService.getLikesMap(
      feedVideoItems.map((item) => ({
        itemId: item.id,
        source: item.source,
        entity: item.relatedTo.entity,
      })),
    );
    for (const item of feedVideoItems) {
      item.stats.likes =
        likesMap.get(
          this.feedEngagementService.makeKey({
            itemId: item.id,
            source: item.source,
            entity: item.relatedTo.entity,
          }),
        ) ?? item.stats.likes;
    }

    // 6. Merge + sort
    const allItems = [...legacyItems, ...feedVideoItems].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );

    // 7. Build next cursor
    const lastFeedVideo = feedVideosPage[feedVideosPage.length - 1];
    const nextCursor =
      lastFeedVideo && hasMore
        ? encodeCursor({
            lastId: lastFeedVideo.id,
            lastCreatedAt:
              lastFeedVideo.createdAt?.toISOString() ??
              new Date().toISOString(),
          })
        : null;

    return {
      data: allItems,
      cursor: nextCursor,
      has_more: hasMore,
    };
  }
}
