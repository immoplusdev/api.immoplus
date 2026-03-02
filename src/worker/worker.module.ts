import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { JwtModule } from "@nestjs/jwt";
import { S3Module } from "@/infrastructure/features/files/s3.module";
import { TypeormModule } from "@/infrastructure/typeorm";
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
        connection: {
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: config.get<number>("REDIS_PORT", 6379),
          password: config.get<string>("REDIS_PASSWORD"),
        },
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
