import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletEntity } from "./wallet.entity";
import { TransactionSource, TransactionType, Wallet, WalletOperators } from "@/core/domain/wallet";
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

    @Column({ type: 'enum', enum: TransactionSource, nullable: true })
    source?: TransactionSource;

    @Column({ name: "source_id", nullable: true })
    sourceId?: string; // ID de la réservation, ou du retrait

    @Column({ name: "operator", type: 'enum', enum: WalletOperators, nullable: true })
    operator?: WalletOperators;

    @Column({ nullable: true })
    note?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date; 

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy?: string; // ID de l'utilisateur qui a créé la transaction

    @Column({ name: "release_date", type: "timestamp", nullable: true })
    releaseDate?: Date
    @Column({ name: "is_realeased", type: "boolean", default: false })
    isRealeased?: boolean; // Indique si la transaction a deja ete 
    
    @Column({ name: "released_at", type: "timestamp", nullable: true })
    releasedAt?: Date;  
}