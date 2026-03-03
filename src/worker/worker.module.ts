import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { JwtModule } from "@nestjs/jwt";
import { S3Module } from "@/infrastructure/features/files/s3.module";
import { TypeormModule } from "@/infrastructure/typeorm";
import { getRedisConnection } from "@/infrastructure/redis/redis-connection";
import {
  QUEUE_VIDEO_PROCESSING,
  QUEUE_VIEW_EVENTS,
} from "@/infrastructure/features/feed/queue/feed-queue.constants";
import {
  VideoProcessingProcessor,
  ViewEventsProcessor,
} from "./processors/video-processing.processor";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeormModule,
    S3Module,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: getRedisConnection(config),
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_VIDEO_PROCESSING },
      { name: QUEUE_VIEW_EVENTS },
    ),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow("JWT_SECRET"),
      }),
    }),
  ],
  providers: [VideoProcessingProcessor, ViewEventsProcessor],
})
export class WorkerModule {}
