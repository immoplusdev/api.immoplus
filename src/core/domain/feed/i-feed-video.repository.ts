import { IBaseRepository } from "@/core/domain/common/repositories";
import { FeedVideo } from "./feed-video.model";

export interface IFeedVideoRepository extends IBaseRepository<
  FeedVideo,
  Partial<FeedVideo>,
  Partial<FeedVideo>
> {}
