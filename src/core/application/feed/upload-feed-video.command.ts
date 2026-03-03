import { FeedParentType } from "@/core/domain/feed";
import { OmitMethods } from "@/lib/ts-utilities";

export class UploadFeedVideoCommand {
  /** ID of the file record already saved in the `files` table */
  videoFileId: string;
  /** S3 key of the raw video (externalFileId from the file record) */
  videoS3Key: string;
  parentType: FeedParentType;
  parentId: string;
  titre?: string;
  description?: string;
  createdBy: string;

  constructor(data?: OmitMethods<UploadFeedVideoCommand>) {
    if (data) Object.assign(this, data);
  }
}
