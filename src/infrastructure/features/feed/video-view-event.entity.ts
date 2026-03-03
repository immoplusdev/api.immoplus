import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("video_view_events")
export class VideoViewEventEntity {
  @PrimaryColumn({ type: "varchar", length: 36 })
  id: string;

  @Column({ name: "video_id", type: "varchar", length: 36 })
  videoId: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId: string;

  @Column({ name: "watch_duration_ms", type: "int", default: 0 })
  watchDurationMs: number;

  @CreateDateColumn({ name: "viewed_at" })
  viewedAt?: Date;
}
