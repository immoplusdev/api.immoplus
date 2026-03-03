import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("short_links")
export class ShortLinkEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ name: "code", type: "varchar", length: 10 })
  code: string;

  @Column({ name: "feed_video_id", type: "varchar", length: 36 })
  feedVideoId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
