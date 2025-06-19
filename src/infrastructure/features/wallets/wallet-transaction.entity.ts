import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { WalletEntity } from "./wallet.entity";
import { TransactionType } from "@/core/domain/wallet";

// @Entity("transactions")
// export class WalletTransactionEntity {
//    @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => WalletEntity, wallet => wallet.transactions)
//   wallet: WalletEntity;

//   @Column({ type: 'enum', enum: TransactionType })
//   type: TransactionType;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   amount: number;

//   @Column({ nullable: true })
//   reference?: string; // ID de la réservation, ou du retrait

//   @Column({ nullable: true })
//   note?: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }