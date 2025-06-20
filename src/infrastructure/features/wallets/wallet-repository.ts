import { DEFAULT_CURRENCY, IWalletRepository, Wallet, WalletTransaction, WalletWithDrawalRequest } from "@/core/domain/wallet";
import { WalletsService } from "./wallet.service";
import { User } from "@/core/domain/users";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

export class WalletsRepository implements IWalletRepository {
    constructor(
        @Inject(Deps.WalletsService) private readonly walletService: WalletsService
    ) {}

    findWalletByOwner(ownerId: string): Promise<Wallet>{
        return this.walletService.findWalletByOwner(ownerId);
    }

    creditWallet(ownerId: string, amount: number, reservationId: string, currency?: string): Promise<Wallet>
    {
        return this.walletService.creditWallet(ownerId, amount, reservationId, currency||DEFAULT_CURRENCY);
    }
    debitWallet(ownerId: string, amount: number, reservationId: string, currency?: string): Promise<Wallet>
    {
        return this.walletService.debitWallet(ownerId, amount, reservationId, currency);
    }

    releaseFunds(ownerId: string, amount: number, reservationId: string, currency?: string) : Promise<Wallet>
    {
        return this.walletService.releaseFunds(ownerId, amount, reservationId, currency);
    }

    findWalletTransactionById(id: string): Promise<WalletTransaction> {
        return  this.walletService.findWalletTransactionById(id);
    }

    findWalletTransactionsByWallet(ownerId: string): Promise<WalletTransaction[]> {
        return this.walletService.findWalletTransactionsByWallet(ownerId);
    }

    
    deleteWalletTransaction(id: string): Promise<void> {
        return this.walletService.deleteWalletTransaction(id);
    }
   

    createWithdrawalRequest(request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        return this.walletService.createWithdrawalRequest(request);
    }
    updateWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest> {
        return this.walletService.updateWithdrawalRequest(id, request);
    }
    findWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest> {
        return this.walletService.findWithdrawalRequestById(id);
    }
    findWithdrawalRequestsByOwner(owner: string): Promise<WalletWithDrawalRequest[]> {
        return this.walletService.findWithdrawalRequestsByOwner(owner);
    }
    deleteWithdrawalRequest(id: string): Promise<void> {
        return this.walletService.deleteWithdrawalRequest(id);
    }
   
}
