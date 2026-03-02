import { Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { UserModule } from "@/infrastructure/features/users";
import { FeedVideoRepository } from "./feed-video.repository";
import { VideoLikeRepository } from "./video-like.repository";
import { FeedController } from "./feed.controller";
import {
  CreateFeedVideoCommandHandler,
  UploadFeedVideoCommandHandler,
} from "@/core/application/feed";
import { FurnitureModule } from "@/infrastructure/features/furniture";
import { ResidenceModule } from "@/infrastructure/features/residences";
import { BienImmobilierModule } from "@/infrastructure/features/biens-immobiliers";
import { FeedEngagementService } from "./feed-engagement.service";
import { FeedQueueModule } from "./queue/feed-queue.module";
import { FeedGateway } from "./feed.gateway";
import { FileModule } from "@/infrastructure/features/files";

const commandHandlers = [
  CreateFeedVideoCommandHandler,
  UploadFeedVideoCommandHandler,
];

const providers: Provider[] = [
  {
    provide: Deps.FeedVideoRepository,
    useClass: FeedVideoRepository,
  },
  {
    provide: Deps.VideoLikeRepository,
    useClass: VideoLikeRepository,
  },
];

@Module({
  controllers: [FeedController],
  imports: [
    TypeormModule,
    CqrsModule,
    UserModule,
    FurnitureModule,
    ResidenceModule,
    BienImmobilierModule,
    FeedQueueModule,
    FileModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
      }),
    }),
  ],
  providers: [
    ...providers,
    FeedEngagementService,
    FeedGateway,
    ...commandHandlers,
  ],
  exports: [...providers],
})
export class FeedModule {}
