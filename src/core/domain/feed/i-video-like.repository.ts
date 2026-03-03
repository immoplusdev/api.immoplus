import { VideoLike } from "./video-like.model";

export interface IVideoLikeRepository {
  findByVideoAndUser(
    videoId: string,
    userId: string,
  ): Promise<VideoLike | null>;
  create(like: VideoLike): Promise<VideoLike>;
  delete(videoId: string, userId: string): Promise<void>;
  countByVideo(videoId: string): Promise<number>;
}
