import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CreateFeedVideoCommand } from "./create-feed-video.command";
import { Deps } from "@/core/domain/common/ioc";
import { FeedVideo, IFeedVideoRepository } from "@/core/domain/feed";

@CommandHandler(CreateFeedVideoCommand)
export class CreateFeedVideoCommandHandler implements ICommandHandler<CreateFeedVideoCommand> {
  constructor(
    @Inject(Deps.FeedVideoRepository)
    private readonly feedVideoRepository: IFeedVideoRepository,
  ) {
    //
  }

  async execute(command: CreateFeedVideoCommand): Promise<FeedVideo> {
    const data: Partial<FeedVideo> = {
      videoId: command.videoId,
      parentType: command.parentType,
      parentId: command.parentId,
      titre: command.titre,
      description: command.description,
      createdBy: command.createdBy,
    };

    return await this.feedVideoRepository.createOne(data);
  }
}
