import { OmitMethods } from "@/lib/ts-utilities";
import { FeedParentType } from "./feed-parent-type.enum";
import { FeedVideoStatus } from "./feed-video-status.enum";

export class FeedVideo {
  id: string;
  videoId: string;
  parentType: FeedParentType;
  parentId: string;
  titre?: string;
  description?: string;
  status?: FeedVideoStatus;
  thumbnailUrl?: string;
  durationMs?: number;
  width?: number;
  height?: number;
  likesCount?: number;
  viewCount?: number;
  createdAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<FeedVideo>) {
    if (data) Object.assign(this, data);
  }
}
