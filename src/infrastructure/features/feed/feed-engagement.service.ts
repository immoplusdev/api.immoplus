import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { FeedParentType } from "@/core/domain/feed";
import { Deps } from "@/core/domain/common/ioc";
import { VideoLikeEntity } from "./video-like.entity";

export type FeedItemSource = "post" | "legacy";

export interface FeedEngagementKey {
  itemId: string;
  source: FeedItemSource;
  entity: FeedParentType;
}

@Injectable()
export class FeedEngagementService {
  constructor(
    @Inject(Deps.DataSource) private readonly dataSource: DataSource,
  ) {}

  makeKey(item: FeedEngagementKey): string {
    return `${item.source}:${item.entity}:${item.itemId}`;
  }

  /** Batch-fetch likes counts for a list of feed items (post source only). */
  async getLikesMap(items: FeedEngagementKey[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    for (const item of items) result.set(this.makeKey(item), 0);

    const postItems = items.filter((i) => i.source === "post");
    if (postItems.length === 0) return result;

    const videoIds = postItems.map((i) => i.itemId);
    const repo = this.dataSource.getRepository(VideoLikeEntity);

    const rows: { video_id: string; cnt: string }[] = await repo
      .createQueryBuilder("vl")
      .select("vl.video_id", "video_id")
      .addSelect("COUNT(*)", "cnt")
      .where("vl.video_id IN (:...videoIds)", { videoIds })
      .groupBy("vl.video_id")
      .getRawMany();

    for (const row of rows) {
      const item = postItems.find((i) => i.itemId === row.video_id);
      if (item) result.set(this.makeKey(item), Number(row.cnt));
    }

    return result;
  }
}
