import { User } from "../users"
import { WalletTransaction } from "./wallet-transaction.model"
import { Wallet } from "./wallet.model"
import { WithDrawalRequest, WithdrawalStatus } from "./withdrawal-request.model"

export interface IWalletRepository {
    findWalletById(id: string): Promise<Wallet>
    findWalletByOwner(owner: User | string): Promise<Wallet>

    createWalletTransaction(transaction: Partial<WalletTransaction>): Promise<WalletTransaction>
    updateWalletTransaction(transaction: WalletTransaction): Promise<WalletTransaction>
    findWalletTransactionById(id: string): Promise<WalletTransaction>
    deleteWalletTransaction(id: string): Promise<void>
    findWalletTransactionsByWallet(wallet: string): Promise<WalletTransaction[]>

    createWithdrawalRequest(request: Partial<WithDrawalRequest>): Promise<WithDrawalRequest>
    updateWithdrawalRequest(request: Partial<WithDrawalRequest>): Promise<WithDrawalRequest>
    findWithdrawalRequestById(id: string): Promise<WithDrawalRequest>
    findWithdrawalRequestsByOwner(owner: User | string): Promise<WithDrawalRequest[]>
    deleteWithdrawalRequest(id: string): Promise<void>
    findWithdrawalRequestsByWallet(wallet: string): Promise<WithDrawalRequest[]>
}   