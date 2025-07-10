import { User } from "../users"
import { WalletTransaction } from "./wallet-transaction.model"
import { Wallet } from "./wallet.model"
import { WalletWithDrawalRequest } from "./wallet-withdrawal-request.model"
import { TransactionSource, WalletOperators } from "./wallet.enum"

export interface IWalletRepository {
    findWalletByOwner(ownerId: string): Promise<Wallet>
    creditWallet(ownerId: string, amount: number, currency?: string, source?: TransactionSource, sourceId?: string , operator?: WalletOperators, note?: string, releaseDate?: Date): Promise<Wallet>
    debitWallet(ownerId: string, amount: number, currency?: string, source?: TransactionSource, sourceId?: string , operator?: WalletOperators, note?: string): Promise<Wallet>
    releaseFunds(ownerId: string, amount: number, currency?: string, source?: TransactionSource, sourceId?: string, note?: string) : Promise<Wallet>

    findWalletTransactionById(id: string): Promise<WalletTransaction>
    findWalletTransactionsByOwner(ownerId: string): Promise<WalletTransaction[]>
    deleteWalletTransaction(id: string): Promise<void>

    createWalletWithdrawalRequest(request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest>
    updateWalletWithdrawalRequest(id: string, request: Partial<WalletWithDrawalRequest>): Promise<WalletWithDrawalRequest>
    findWalletWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest>
    findWalletWithdrawalRequestsByOwner(owner: User | string): Promise<WalletWithDrawalRequest[]>
    deleteWalletWithdrawalRequest(id: string): Promise<void>
}   

