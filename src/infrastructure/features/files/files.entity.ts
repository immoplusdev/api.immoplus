import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FileStorage } from "@/core/domain/files";
import { UserEntity } from "@/infrastructure/features/users";
import { User } from "@/core/domain/users";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: "filename_disk", type: "varchar" })
  fileNameDisk: string;
  @Column({ name: "title", type: "varchar", nullable: true })
  title?: string;
  @Column({ name: "filename_download", type: "varchar", nullable: true })
  fileNameDownload?: string;
  @Column({ name: "storage", type: "varchar", default: FileStorage.Local })
  storage?: string;
  @Column({ name: "type", type: "varchar", nullable: true })
  type?: string;
  @Column({ name: "folder", type: "varchar", nullable: true })
  folder?: string;
  @Column({ name: "uploaded_by", type: "uuid" })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "uploaded_by" })
  uploadedBy?: User | string;
  @CreateDateColumn({ name: "uploaded_on" })
  uploadedOn?: Date;
  @Column({ name: "modified_by", type: "uuid", nullable: true  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "modified_by"})
  modifiedBy?: User | string;
  @UpdateDateColumn({ name: "modified_on" })
  modifiedOn?: Date;
  @DeleteDateColumn({ name: "deleted_on" })
  deletedOn?: Date;
  @Column({ name: "charset", type: "varchar", nullable: true })
  charset?: string ;
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
  @Column({ name: "description", type: "varchar", nullable: true })
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
}
