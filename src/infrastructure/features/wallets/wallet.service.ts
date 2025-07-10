import { Deps } from '@/core/domain/common/ioc';
import { DEFAULT_CURRENCY, TransactionSource, TransactionType, Wallet, WalletOperators, WalletTransaction, WalletWithDrawalRequest } from '@/core/domain/wallet';
import { BaseRepository } from '@/infrastructure/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { CreateWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/create-wallet-withdrawal-request.command';
import { WalletTransactionEntity } from './wallet-transaction.entity';
import { NotEnoughtMoneyException } from '@/core/domain/wallet/exceptions/not-enought-money.exception';
import { WalletWithdrawalRequestEntity } from './wallet-withdrawal-request.entity';

@Injectable()
export class WalletsService {
    private readonly walletRepo: BaseRepository<Wallet>;
    private readonly walletTransactionRepo: BaseRepository<WalletTransaction>;
    private readonly walletWithdrawalRepo: BaseRepository<WalletWithDrawalRequest>;
    constructor(
        @Inject(Deps.DataSource) readonly dataSource: DataSource
    ) {
        this.walletRepo = new BaseRepository(dataSource, WalletEntity).setLoadRelationIds(true);
        this.walletTransactionRepo = new BaseRepository(dataSource, WalletTransactionEntity).setLoadRelationIds(true);
        this.walletWithdrawalRepo = new BaseRepository(dataSource, WalletWithdrawalRequestEntity).setLoadRelationIds(true);
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

    async creditWallet(
        ownerId: string, 
        amount: number, 
        currency?: string, 
        source=TransactionSource.AUTRE, 
        sourceId?: string, 
        operator?: WalletOperators,  
        note?: string, 
        releaseDate?: Date
    ): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);
        const pendingBalance = +wallet.pendingBalance + amount;

        await this.walletTransactionRepo.createOne({
            wallet,
            type: TransactionType.BLOCK,
            amount,
            currency,
            source,
            sourceId,
            operator,
            note: note || "Crédit bloqué en attente de validation",
            createdBy: ownerId,
            releaseDate
        });

        await this.walletRepo.updateOne(wallet.id, { pendingBalance: pendingBalance});
        return this.walletRepo.findOne(wallet.id);
    }

    async debitWallet( 
        ownerId: string, 
        amount: number, 
        currency?: string, 
        source=TransactionSource.AUTRE, 
        sourceId?: string, 
        operator?: WalletOperators,  
        note?: string
    ): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);
        if(wallet.availableBalance < amount) {
            throw new NotEnoughtMoneyException();
        }
        const newAvailableBalance = +wallet.availableBalance - amount;

        await this.walletTransactionRepo.createOne({
            wallet,
            type: TransactionType.DEBIT,
            amount,
            currency,
            source,
            sourceId: sourceId,
            operator,
            note: note || 'Débit du compte',
            createdBy: ownerId
        });

       await this.walletRepo.updateOne(wallet.id, { availableBalance: newAvailableBalance });
       return this.walletRepo.findOne(wallet.id);
    }

    async releaseFunds(ownerId: string, amount: number,currency=DEFAULT_CURRENCY, source?:TransactionSource, sourceId?: string, note?: string): Promise<Wallet> {
        const wallet = await this.findWalletByOwner(ownerId);

        if(wallet.pendingBalance < amount) {
            throw new NotEnoughtMoneyException();
        }

        const pendingBalance = +wallet.pendingBalance - amount;
        const availableBalance = +wallet.availableBalance + amount;

      

        await this.walletTransactionRepo.createMany([
            {
                wallet,
                type: TransactionType.UNBLOCK,
                amount,
                currency,
                source,
                sourceId,
                note: note || 'Déblocage suite à fin de réservation',
                createdBy: ownerId,
            },
            {
                wallet,
                type: TransactionType.CREDIT,
                amount,
                currency,
                source,
                sourceId,
                note: note || 'Crédit du compte disponible',
                createdBy: ownerId
            }
        ]);


        const transaction = await this.walletTransactionRepo.findOneByQuery({
          _where:
            [
                {
                    _field: "wallet",
                    _op: "eq",
                    _val: wallet.id
                },
                {
                    _field: "type",
                    _op: "eq",
                    _val: TransactionType.BLOCK
                },
                {
                    _field: "isRealeased",
                    _op: "eq",
                    _val: false
                },
                {
                    _field: "amount",
                    _op: "eq",
                    _val: amount
                }
            ]
        });

        if(!transaction) {
            await this.walletTransactionRepo.updateOne(transaction.id, {isRealeased: true, releasedAt: new Date() });
        }


        await this.walletRepo.updateOne(wallet.id, { pendingBalance, availableBalance });
        return this.walletRepo.findOne(wallet.id);
    }

    async findWalletTransactionById(id: string): Promise<WalletTransaction> {
        const transaction = await this.walletTransactionRepo.findOne(id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }

    async findWalletTransactionsByOwner(ownerId: string): Promise<WalletTransaction[]> {
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

    async createWalletWithdrawalRequest(request: CreateWalletWithdrawalRequestCommand): Promise<WalletWithDrawalRequest> {
        const wallet = await this.findWalletByOwner(request.owner);
        if(wallet.availableBalance < +request.amount) {
            throw new NotEnoughtMoneyException();
        }
        const newRequest = new WalletWithDrawalRequest({
            ...request,
           wallet
        });
        
        return this.walletWithdrawalRepo.createOne(newRequest);
    }

    async updateWalletWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        await this.walletWithdrawalRepo.updateOne(id, request);
        return this.walletWithdrawalRepo.findOne(id);
    }

    async findWalletWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest> {
        const walletWithdrawal = await this.walletWithdrawalRepo.findOne(id);
        return walletWithdrawal;
    }

    async findWalletWithdrawalRequestsByOwner(owner: string): Promise<WalletWithDrawalRequest[]> {
        const requests = await this.walletWithdrawalRepo.findByQuery({
            _where:
            [
                {
                    _field: "owner",
                    _op: "eq",
                    _val: owner,
                }
            ],
            _order_by: 'createdAt',
            _order_dir: 'desc'
        });

        return requests.data;
    }

    async deleteWalletWithdrawalRequest(id: string): Promise<void> {
        await this.walletWithdrawalRepo.deleteOne(id);
    }



}
