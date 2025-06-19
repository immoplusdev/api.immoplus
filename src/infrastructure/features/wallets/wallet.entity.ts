import { User } from "@/core/domain/users";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../users";
// import { WalletTransactionEntity } from "./wallet-transaction.entity";

// @Entity("wallets")
// export class WalletEntity {
//     @PrimaryGeneratedColumn("uuid")
//     id: string;

//     // @OneToOne(() => UserEntity, user => user.wallet)
//     // @JoinColumn()
//     // owner: User;

//     @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//     availableBalance: number; // Retirable

//     @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//     pendingBalance: number; // En attente de déblocage

//     @OneToMany(() => WalletTransactionEntity, transaction => transaction.wallet)
//     transactions: WalletTransactionEntity[];

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
// }
