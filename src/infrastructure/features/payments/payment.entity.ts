import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OmitMethods } from "@/lib/ts-utilities";
import {
  PaymentCollection,
  PaymentMethod,
  PaymentNextAction,
  PaymentStatus,
  PaymentType,
} from "@/core/domain/payments";
import { UserEntity } from "@/infrastructure/features/users";
import { User } from "@/core/domain/users";

@Entity("payments")
export class PaymentEntity {

  // Basic Fields
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "amount", type: "int" })
  amount: number;
  @Column({ name: "amount_no_fees", type: "int", nullable: true })
  amountNoFees: number;
  @ManyToOne(() => UserEntity, (item) => item.id, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: User | string;
  @Column({ name: "payment_type", type: "varchar", length: 20, default: PaymentType.Facture })
  paymentType: PaymentType;
  @Column({ name: "collection", type: "varchar", length: 50 })
  collection: PaymentCollection;
  @Column({ name: "payment_status", type: "varchar", length: 50, default: PaymentStatus.Processing })
  paymentStatus: PaymentStatus;
  @Column({ name: "payment_method", type: "varchar", length: 50, default: PaymentMethod.Cash })
  paymentMethod: PaymentMethod;
  @Column({ name: "item_id", type: "varchar", length: 36 })
  itemId: string;
  @Column({ name: "payment_address", type: "varchar", length: 255, nullable: true })
  paymentAddress?: string;

  // Hub2 Fields
  @Column({ name: "hub2_payment_id", type: "varchar", length: 36, nullable: true })
  hub2PaymentId?: string;
  @Column({ name: "hub2_exception", type: "varchar", length: 36, nullable: true })
  hub2Exception?: string;
  @Column({ name: "hub2_next_action", type: "varchar", nullable: true })
  hub2NextAction?: PaymentNextAction;
  @Column({ name: "hub2_token", type: "varchar", nullable: true })
  hub2Token?: string;
  @Column({ name: "hub2_metadata", type: "json", nullable: true })
  hub2Metadata?: Record<string, any>;


  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<PaymentEntity>) {
    if (data) Object.assign(this, data);
  }
}
