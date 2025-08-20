import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../users";
import { User } from "@/core/domain/users";
import {
  TransferItemType,
  TransferStatus,
  TransferType,
} from "@/core/domain/transfers/transfer.enum";
import { PaymentMethod } from "@/core/domain/common/enums";

@Entity("transfers")
export class TransfersEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 3, default: "XOF" })
  currency: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  fees?: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: "customer_id" })
  customer?: string;

  @Column({ name: "item_type", type: "enum", enum: TransferItemType })
  itemType: TransferItemType;

  @Column({ name: "item_id", type: "varchar", length: 36 })
  itemId: string;

  @Column({
    name: "transfer_status",
    type: "enum",
    enum: TransferStatus,
    default: TransferStatus.PENDING,
  })
  transfetStatus: TransferStatus;

  @Column({ name: "transfer_type", type: "enum", enum: TransferType })
  transferType: TransferType;

  @Column({ name: "country", type: "varchar", length: 2 })
  country: string;

  @Column({ name: "account_number", type: "varchar", nullable: true })
  accountNumber?: string;

  @Column({ name: "bank", type: "json", nullable: true })
  bank?: Record<string, any>;

  @Column({ name: "recipient_name", type: "varchar", nullable: true })
  recipientName?: string;

  @Column({
    name: "transfer_provider",
    type: "enum",
    enum: PaymentMethod,
    nullable: true,
  })
  transferProvider?: PaymentMethod;

  @Column({ name: "hub2_transfer_id", type: "varchar", nullable: true })
  hub2TransferId?: string;

  @Column({ name: "hub2_exception", type: "varchar", nullable: true })
  hub2Exception?: string;

  @Column({ name: "hub2_metadata", type: "json", nullable: true })
  hub2Metadata?: Record<string, any>;

  @Column({ name: "created_at", type: "timestamp", nullable: false })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  @Column({ name: "updated_at", type: "timestamp", nullable: false })
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt?: Date;
}
