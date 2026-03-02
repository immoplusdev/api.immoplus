import { FeedParentType } from "@/core/domain/feed";
import { OmitMethods } from "@/lib/ts-utilities";

export class CreateFeedVideoCommand {
  videoId: string;
  parentType: FeedParentType;
  parentId: string;
  titre?: string;
  description?: string;
  createdBy: string;

  constructor(data?: OmitMethods<CreateFeedVideoCommand>) {
    if (data) Object.assign(this, data);
  }
}
