import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import { getRedisConnection } from "@/infrastructure/redis/redis-connection";
import {
  QUEUE_VIDEO_PROCESSING,
  QUEUE_VIEW_EVENTS,
} from "./feed-queue.constants";

@Module({
  imports: [
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
  ],
  exports: [BullModule],
})
export class FeedQueueModule {}
