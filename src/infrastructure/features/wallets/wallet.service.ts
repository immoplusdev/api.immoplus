import { Deps } from '@/core/domain/common/ioc';
import { DEFAULT_CURRENCY, TransactionType, Wallet, WalletTransaction, WalletWithDrawalRequest } from '@/core/domain/wallet';
import { BaseRepository } from '@/infrastructure/typeorm';
import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Injectable()
export class WalletsService {
    private readonly walletRepo: BaseRepository<Wallet>;
    private readonly walletTransactionRepo: BaseRepository<WalletTransaction>;
    private readonly walletWithdrawalRepo: BaseRepository<WalletWithDrawalRequest>;
    constructor(
        @Inject(Deps.DataSource) readonly dataSource: DataSource
    ) {
        this.walletRepo = new BaseRepository(dataSource, WalletEntity).setLoadRelationIds(true);
        this.walletTransactionRepo = new BaseRepository(dataSource, WalletTransaction).setLoadRelationIds(true);
        this.walletWithdrawalRepo = new BaseRepository(dataSource, WalletWithDrawalRequest).setLoadRelationIds(true);
    }


    async findWalletByOwner(ownerId: string): Promise<Wallet> {
        let wallet = await this.walletRepo.findOneByQuery({
            _where:
                [
                    {
                        _field: "owner",
                        _op: "eq",
                        _val: ownerId,
                    },
                ],
        });

        if (!wallet) {
            wallet = await this.walletRepo.createOne({
                owner: ownerId,
                availableBalance: 0,
                pendingBalance: 0,
                currency: DEFAULT_CURRENCY
            });
        };

        return wallet;
    }

    async findWalletTransactionById(id: string): Promise<WalletTransaction> {
        return this.walletTransactionRepo.findOne(id);
    }

    async findWalletTransactionsByWallet(ownerId: string): Promise<WalletTransaction[]> {
        const wallet = await this.findWalletByOwner(ownerId);
        const transactions = await this.walletTransactionRepo.findByQuery({
            _order_by: "created_at",
            _where:
                [
                    {
                        _field: "wallet",
                        _op: "eq",
                        _val: wallet.id,
                    },
                ],
        });

        return transactions.data;
    }

    async deleteWalletTransaction(id: string): Promise<void> {
        await this.walletTransactionRepo.deleteOne(id);
    }

    async createWithdrawalRequest(request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        return this.walletWithdrawalRepo.createOne(request);
    }

    async updateWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        await this.walletWithdrawalRepo.updateOne(id, request);
        return this.walletWithdrawalRepo.findOne(id);
    }

    async findWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest> {
        return this.walletWithdrawalRepo.findOne(id);
    }

    async findWithdrawalRequestsByOwner(owner: string): Promise<WalletWithDrawalRequest[]> {
        const requests = await this.walletWithdrawalRepo.findByQuery({
            _where:
            [
                {
                    _field: "owner",
                    _op: "eq",
                    _val: owner,
                }
            ]
        });

        return requests.data;
    }

    async deleteWithdrawalRequest(id: string): Promise<void> {
        await this.walletWithdrawalRepo.deleteOne(id);
    }


    async creditWallet(ownerId: string, amount: number, reservationId: string, currency=DEFAULT_CURRENCY): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);
        wallet.pendingBalance += amount;

        await this.walletTransactionRepo.createOne({
            wallet,
            type: TransactionType.BLOCK,
            amount,
            currency,
            reference: "Ref reservation : " + reservationId,
            note: 'Crédit bloqué en attente de fin de réservation',
            createdBy: ownerId
        });

        await this.walletRepo.updateOne(wallet.id, { pendingBalance: wallet.pendingBalance });
        return this.walletRepo.findOne(wallet.id);
    }

    async debitWallet(ownerId: string, amount: number, reservationId: string, currency=DEFAULT_CURRENCY): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);
        wallet.pendingBalance -= amount;

        await this.walletTransactionRepo.createOne({
            wallet,
            type: TransactionType.DEBIT,
            amount,
            currency,
            reference:  reservationId,
            note: 'Débit du compte',
            createdBy: ownerId
        });

       await this.walletRepo.updateOne(wallet.id, { pendingBalance: wallet.pendingBalance });
       return this.walletRepo.findOne(wallet.id);
    }

    async releaseFunds(ownerId: string, amount: number, reservationId: string, currency=DEFAULT_CURRENCY): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);

        const pendingBalance = wallet.pendingBalance -= amount;
        const availableBalance = wallet.availableBalance += amount;

        await this.walletTransactionRepo.createMany([
            {
                wallet,
                type: TransactionType.UNBLOCK,
                amount,
                currency,
                reference: reservationId,
                note: 'Déblocage suite à fin de réservation',
                createdBy: ownerId
            },
            {
                wallet,
                type: TransactionType.CREDIT,
                amount,
                currency,
                reference: reservationId,
                note: 'Crédit dans balance disponible',
                createdBy: ownerId
            }
        ]);

        await this.walletRepo.updateOne(wallet.id, { pendingBalance, availableBalance });
        return this.walletRepo.findOne(wallet.id);
    }

}
