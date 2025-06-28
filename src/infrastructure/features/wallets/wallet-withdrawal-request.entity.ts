import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../users";
import { WalletOperators, WithdrawalStatus } from "@/core/domain/wallet";
import { User } from "@/core/domain/users";

@Entity({ name: 'wallet_withdrawal_requests' })
export class WalletWithdrawalRequestEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, user => user.id, { eager: true })
  @JoinColumn({ name: "user_id" })
  owner: User | string; // ID of the user who made the withdrawal request

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string; // ISO 4217 currency code

  @Column({ name: "phone_number", type: "varchar" })
  phoneNumber?: string;

  @Column({ name: "operator", type: 'enum', enum: WalletOperators, nullable: true })
  operator?: WalletOperators;

  @Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  status: WithdrawalStatus;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn({ name: "created_at", nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date; // Uncomment if soft delete is needed
}