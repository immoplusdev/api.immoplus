import { User } from "../users"
import { WalletTransaction } from "./wallet-transaction.model"
import { Wallet } from "./wallet.model"
import { WalletWithDrawalRequest } from "./wallet-withdrawal-request.model"
import { DEFAULT_CURRENCY } from "./index"

export interface IWalletRepository {
    findWalletByOwner(owner: User | string): Promise<Wallet>
    creditWallet(ownerId: string, amount: number, reservationId: string, currency?: string): Promise<Wallet>
    debitWallet(ownerId: string, amount: number, reservationId: string, currency?: string): Promise<Wallet>
    releaseFunds(ownerId: string, amount: number, reservationId: string, currency?: string) : Promise<Wallet>

    findWalletTransactionById(id: string): Promise<WalletTransaction>
    findWalletTransactionsByWallet(ownerId: string): Promise<WalletTransaction[]>
    deleteWalletTransaction(id: string): Promise<void>

    createWithdrawalRequest(request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest>
    updateWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest>
    findWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest>
    findWithdrawalRequestsByOwner(owner: User | string): Promise<WalletWithDrawalRequest[]>
    deleteWithdrawalRequest(id: string): Promise<void>
}   