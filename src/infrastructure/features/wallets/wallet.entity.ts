import { User } from "@/core/domain/users";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../users";
import { WalletTransactionEntity } from "./wallet-transaction.entity";
import { WalletTransaction } from "@/core/domain/wallet";

@Entity("wallets")
export class WalletEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: "owner_id" })
  owner: User | string; // ID de l'utilisateur propriétaire du portefeuille

  @Column({
    name: "available_balance",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  availableBalance: number; // Retirable

  @Column({
    name: "pending_balance",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  pendingBalance: number; // En attente de déblocage

  @Column({ name: "currency", type: "varchar", length: 3, nullable: false })
  currency: string; // ISO 4217 currency code

  @OneToMany(() => WalletTransactionEntity, (transaction) => transaction.wallet)
  transactions: WalletTransaction[];

  @CreateDateColumn({ name: "created_at", nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: false })
  updatedAt: Date;
}
