import { Module } from "@nestjs/common";
import { TypeormModule } from "@/infrastructure/typeorm";
import { S3Module } from "@/infrastructure/features/files/s3.module";
import { FeedQueueModule } from "./queue/feed-queue.module";
import {
  VideoProcessingProcessor,
  ViewEventsProcessor,
} from "@/worker/processors/video-processing.processor";

@Module({
  imports: [
    TypeormModule,
    S3Module,
    FeedQueueModule, // garantit que BullModule.forRootAsync est résolu avant les processors
  ],
  providers: [VideoProcessingProcessor, ViewEventsProcessor],
})
export class FeedProcessorsModule {}
