import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IVideoLikeRepository, VideoLike } from "@/core/domain/feed";
import { VideoLikeEntity } from "./video-like.entity";

@Injectable()
export class VideoLikeRepository implements IVideoLikeRepository {
  private readonly repo: Repository<VideoLikeEntity>;

  constructor(@Inject(Deps.DataSource) dataSource: DataSource) {
    this.repo = dataSource.getRepository(VideoLikeEntity);
  }

  async findByVideoAndUser(
    videoId: string,
    userId: string,
  ): Promise<VideoLike | null> {
    const entity = await this.repo.findOne({ where: { videoId, userId } });
    if (!entity) return null;
    return new VideoLike({
      userId: entity.userId,
      videoId: entity.videoId,
      createdAt: entity.createdAt,
    });
  }

  async create(like: VideoLike): Promise<VideoLike> {
    const entity = this.repo.create({
      userId: like.userId,
      videoId: like.videoId,
    });
    await this.repo.save(entity);
    return new VideoLike({
      userId: entity.userId,
      videoId: entity.videoId,
      createdAt: entity.createdAt,
    });
  }

  async delete(videoId: string, userId: string): Promise<void> {
    await this.repo.delete({ videoId, userId });
  }

  async countByVideo(videoId: string): Promise<number> {
    return this.repo.count({ where: { videoId } });
  }
}
