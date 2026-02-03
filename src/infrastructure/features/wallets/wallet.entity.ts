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

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "owner_id" })
  owner: User | string; // ID de l'utilisateur propriétaire du portefeuille

  @Column({
    name: "available_balance",
    type: "bigint",
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  availableBalance: number; // Retirable

  @Column({
    name: "pending_balance",
    type: "bigint",
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  pendingBalance: number; // En attente de déblocage

  @Column({ name: "currency", type: "varchar", length: 3, nullable: false })
  currency: string; // ISO 4217 currency code

  @Column({ name: "pin_hash", type: "varchar", length: 255, nullable: true })
  pinHash?: string;

  @OneToMany(() => WalletTransactionEntity, (transaction) => transaction.wallet)
  transactions: WalletTransaction[];

  @CreateDateColumn({ name: "created_at", nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: false })
  updatedAt: Date;
}
