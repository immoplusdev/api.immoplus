import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("video_likes")
export class VideoLikeEntity {
  @PrimaryColumn({ name: "user_id", type: "varchar", length: 36 })
  userId: string;

  @PrimaryColumn({ name: "video_id", type: "varchar", length: 36 })
  videoId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
