import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import {
  QUEUE_VIDEO_PROCESSING,
  QUEUE_VIEW_EVENTS,
} from "./feed-queue.constants";

@Module({
  imports: [
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
  ],
  exports: [BullModule],
})
export class FeedQueueModule {}
