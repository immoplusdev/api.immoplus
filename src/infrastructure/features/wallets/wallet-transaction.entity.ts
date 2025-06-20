import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletEntity } from "./wallet.entity";
import { TransactionType, Wallet } from "@/core/domain/wallet";
import { UserEntity } from "../users";

@Entity("wallet_transactions")
export class WalletTransactionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => WalletEntity, wallet => wallet.id, { eager: true })
    @JoinColumn({ name: "wallet_id" })
    wallet: Wallet | string; // ID du portefeuille associé

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 3 })
    currency: string; // ISO 4217 currency code

    @Column({ nullable: true })
    reference?: string; // ID de la réservation, ou du retrait

    @Column({ nullable: true })
    note?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date; // Uncomment if soft delete is needed

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy?: string; // ID de l'utilisateur qui a créé la transaction
}