import { OmitMethods } from "@/lib/ts-utilities";

export class VideoLike {
  userId: string;
  videoId: string;
  createdAt?: Date;

  constructor(data?: OmitMethods<VideoLike>) {
    if (data) Object.assign(this, data);
  }
}
