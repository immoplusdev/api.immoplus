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
import { NotificationType } from "@/core/domain/notifications/notification-type.enum";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "type",
    type: "varchar",
    default: NotificationType.Info,
  })
  type: NotificationType;
  @Column({ name: "subject", type: "varchar" })
  subject: string;
  @Column({ name: "message", type: "varchar", nullable: true })
  message?: string;
  @Column({ name: "collection", type: "varchar", nullable: true })
  collection?: string;
  @Column({ name: "item", type: "varchar", nullable: true })
  item?: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "recipient_id" })
  recipient?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "updated_by" })
  // updatedBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "deleted_by" })
  // deletedBy?: string;
}
