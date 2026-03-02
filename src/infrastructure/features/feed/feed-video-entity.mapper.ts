import { IMapper } from "@/lib/ts-utilities";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";
import { FeedVideoEntity } from "./feed-video.entity";
import { FeedVideo } from "@/core/domain/feed";

export class FeedVideoEntityMapper implements IMapper<
  FeedVideoEntity,
  FeedVideo
> {
  mapFrom(entity: FeedVideoEntity): FeedVideo {
    return new FeedVideo({
      ...entity,
      videoId: getIdFromObject(entity.videoId),
      createdBy: getIdFromObject(entity.createdBy),
    });
  }

  mapTo(model: FeedVideo): FeedVideoEntity {
    return new FeedVideoEntity({
      ...model,
    });
  }
}
