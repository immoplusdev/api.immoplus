import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { UploadFeedVideoCommand } from "./upload-feed-video.command";
import { Deps } from "@/core/domain/common/ioc";
import {
  FeedVideo,
  FeedVideoStatus,
  IFeedVideoRepository,
} from "@/core/domain/feed";
import {
  QUEUE_VIDEO_PROCESSING,
  JOB_PROCESS_VIDEO,
} from "@/infrastructure/features/feed/queue/feed-queue.constants";

@CommandHandler(UploadFeedVideoCommand)
export class UploadFeedVideoCommandHandler implements ICommandHandler<UploadFeedVideoCommand> {
  constructor(
    @Inject(Deps.FeedVideoRepository)
    private readonly feedVideoRepository: IFeedVideoRepository,
    @InjectQueue(QUEUE_VIDEO_PROCESSING)
    private readonly videoQueue: Queue,
  ) {}

  async execute(command: UploadFeedVideoCommand): Promise<FeedVideo> {
    const data: Partial<FeedVideo> = {
      videoId: command.videoFileId,
      parentType: command.parentType,
      parentId: command.parentId,
      titre: command.titre,
      description: command.description,
      createdBy: command.createdBy,
      status: FeedVideoStatus.Processing,
    };

    const feedVideo = await this.feedVideoRepository.createOne(data);

    await this.videoQueue.add(
      JOB_PROCESS_VIDEO,
      {
        feedVideoId: feedVideo.id,
        videoS3Key: command.videoS3Key,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return feedVideo;
  }
}
