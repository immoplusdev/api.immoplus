import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "@/infrastructure/features/users";
import { NotificationType } from "@/core/domain/notifications/notification-type.enum";

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
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
  @Column({ name: "recipient", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "recipient" })
  recipient?: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @Column({ name: "created_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @Column({ name: "updated_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "updated_by" })
  updatedBy?:  string;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
  @Column({ name: "deleted_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "deleted_by" })
  deletedBy?:  string;
}
