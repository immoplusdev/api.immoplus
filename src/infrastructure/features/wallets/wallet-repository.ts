import { DEFAULT_CURRENCY, IWalletRepository, Wallet, WalletTransaction, WalletWithDrawalRequest } from "@/core/domain/wallet";
import { WalletsService } from "./wallet.service";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { CreateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/create-wallet-withdrawal-request.command";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/common/models";

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

    findWalletTransactionsByOwner(query: SearchItemsParams): Promise<WrapperResponse<WalletTransaction[]>> {
        return this.walletService.findWalletTransactionsByOwner(query);
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
    findWalletWithdrawalRequestsByOwner(query: SearchItemsParams): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
        return this.walletService.findWalletWithdrawalRequestsByOwner(query);
    }
    deleteWalletWithdrawalRequest(id: string): Promise<void> {
        return this.walletService.deleteWalletWithdrawalRequest(id);
    }
   
}
