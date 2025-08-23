import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "@/infrastructure/features/users";
import { FileStorage } from "@/core/domain/files";
import { User } from "@/core/domain/users";

@Entity("files")
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "filename_disk", type: "varchar" })
  fileNameDisk: string;
  @Column({ name: "title", type: "varchar", nullable: true })
  title?: string;
  @Column({ name: "filename_download", type: "varchar", nullable: true })
  fileNameDownload?: string;
  @Column({ name: "storage", type: "varchar", default: FileStorage.Minio })
  storage?: string;
  @Column({ name: "external_file_id", type: "varchar", nullable: true })
  externalFileId?: string;
  @Column({ name: "type", type: "varchar", nullable: true })
  type?: string;
  @Column({ name: "folder", type: "varchar", nullable: true })
  folder?: string;

  @Column({ name: "charset", type: "varchar", nullable: true })
  charset?: string;
  @Column({ name: "filesize", type: "int", nullable: true })
  filesize?: number;
  @Column({ name: "width", type: "int", nullable: true })
  width?: number;
  @Column({ name: "height", type: "int", nullable: true })
  height?: number;
  @Column({ name: "duration", type: "int", nullable: true })
  duration?: number;
  @Column({ name: "embed", type: "varchar", nullable: true })
  embed?: string;
  @Column({ name: "description", type: "text", nullable: true })
  description?: string;
  @Column({ name: "location", type: "varchar", nullable: true })
  location?: string;
  @Column({ name: "tags", type: "varchar", nullable: true })
  tags?: string;
  @Column({ name: "metadata", type: "json", nullable: true })
  metadata?: Record<string, any>;
  @Column({ name: "focal_point_x", type: "int", nullable: true })
  focalPointX?: number;
  @Column({ name: "focal_point_y", type: "int", nullable: true })
  focalPointY?: number;
  @Column({ name: "tus_id", type: "varchar", nullable: true })
  tusId?: string;
  @Column({ name: "tus_data", type: "json", nullable: true })
  tusData?: Record<string, any>;

  // tracking fields
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "uploaded_by" })
  uploadedBy?: User | string;
  @CreateDateColumn({ name: "uploaded_on" })
  uploadedOn?: Date;
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "modified_by" })
  modifiedBy?: User | string;
  @UpdateDateColumn({ name: "modified_on" })
  modifiedOn?: Date;
  @DeleteDateColumn({ name: "deleted_on" })
  deletedOn?: Date;
}
