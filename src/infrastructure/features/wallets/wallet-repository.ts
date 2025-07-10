import { DEFAULT_CURRENCY, IWalletRepository, TransactionSource, Wallet, WalletOperators, WalletTransaction, WalletWithDrawalRequest } from "@/core/domain/wallet";
import { WalletsService } from "./wallet.service";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { CreateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/create-wallet-withdrawal-request.command";

export class WalletsRepository implements IWalletRepository {
    constructor(
        @Inject(Deps.WalletsService) private readonly walletService: WalletsService
    ) {}

    findWalletByOwner(ownerId: string): Promise<Wallet>{
        return this.walletService.findWalletByOwner(ownerId);
    }

    creditWallet(ownerId: string, amount: number, currency?: string, source?: TransactionSource, sourceId?: string , operator?: WalletOperators, note?: string, releaseDate?: Date): Promise<Wallet>
    {
        return this.walletService.creditWallet(ownerId, amount, currency, source, sourceId, operator, note, releaseDate);
    }
    debitWallet(ownerId: string, amount: number, currency?: string, source?: TransactionSource, sourceId?: string , operator?: WalletOperators, note?: string): Promise<Wallet>
    {
        return this.walletService.debitWallet(ownerId, amount, currency, source, sourceId, operator, note);
    }

    releaseFunds(ownerId: string, amount: number,currency=DEFAULT_CURRENCY, source?:TransactionSource, sourceId?: string, note?: string) : Promise<Wallet>
    {
        return this.walletService.releaseFunds(ownerId, amount, currency, source, sourceId, note );
    }

    findWalletTransactionById(id: string): Promise<WalletTransaction> {
        return  this.walletService.findWalletTransactionById(id);
    }

    findWalletTransactionsByOwner(ownerId: string): Promise<WalletTransaction[]> {
        return this.walletService.findWalletTransactionsByOwner(ownerId);
    }

    
    deleteWalletTransaction(id: string): Promise<void> {
        return this.walletService.deleteWalletTransaction(id);
    }
   

    createWalletWithdrawalRequest(request: CreateWalletWithdrawalRequestCommand): Promise<WalletWithDrawalRequest> {
        return this.walletService.createWalletWithdrawalRequest(request);
    }
    updateWalletWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        return this.walletService.updateWalletWithdrawalRequest(id, request);
    }
    findWalletWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest> {
        return this.walletService.findWalletWithdrawalRequestById(id);
    }
    findWalletWithdrawalRequestsByOwner(owner: string): Promise<WalletWithDrawalRequest[]> {
        return this.walletService.findWalletWithdrawalRequestsByOwner(owner);
    }
    deleteWalletWithdrawalRequest(id: string): Promise<void> {
        return this.walletService.deleteWalletWithdrawalRequest(id);
    }
   
}
