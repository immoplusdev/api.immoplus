import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FileEntity } from "@/infrastructure/features/files";
import { UserEntity } from "@/infrastructure/features/users";
import { FeedParentType, FeedVideoStatus } from "@/core/domain/feed";
import { OmitMethods } from "@/lib/ts-utilities";

@Entity("feed_videos")
export class FeedVideoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => FileEntity, (f) => f.id, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "video_id" })
  videoId: string;

  @Column({ name: "parent_type", type: "varchar" })
  parentType: FeedParentType;

  @Column({ name: "parent_id", type: "uuid" })
  parentId: string;

  @Column({ name: "titre", type: "varchar", nullable: true })
  titre?: string;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({
    name: "status",
    type: "varchar",
    length: 20,
    default: FeedVideoStatus.Ready,
  })
  status?: FeedVideoStatus;

  @Column({
    name: "thumbnail_url",
    type: "varchar",
    length: 512,
    nullable: true,
  })
  thumbnailUrl?: string;

  @Column({ name: "duration_ms", type: "int", nullable: true })
  durationMs?: number;

  @Column({ name: "width", type: "int", nullable: true })
  width?: number;

  @Column({ name: "height", type: "int", nullable: true })
  height?: number;

  @Column({ name: "likes_count", type: "int", default: 0 })
  likesCount?: number;

  @Column({ name: "view_count", type: "int", default: 0 })
  viewCount?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @ManyToOne(() => UserEntity, (u) => u.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<FeedVideoEntity>) {
    if (data) Object.assign(this, data);
  }
}
