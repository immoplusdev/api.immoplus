import { User } from "../users";
import { WalletTransaction } from "./wallet-transaction.model";
import { Wallet } from "./wallet.model";
import { WalletWithDrawalRequest } from "./wallet-withdrawal-request.model";
import { TransactionSource } from "./wallet.enum";
import { SearchItemsParams } from "../http";
import { WrapperResponse } from "../common/models";
import { PaymentMethod } from "../common/enums";

export interface IWalletRepository {
  findWalletByOwner(ownerId: string): Promise<Wallet>;
  creditWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source?: TransactionSource,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
    releaseDate?: Date,
  ): Promise<Wallet>;
  debitWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source?: TransactionSource,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
  ): Promise<Wallet>;
  releaseFunds(
    ownerId: string,
    amount: number,
    currency?: string,
    source?: TransactionSource,
    sourceId?: string,
    note?: string,
  ): Promise<Wallet>;

  findWalletTransactionById(id: string): Promise<WalletTransaction>;
  findWalletTransactionsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletTransaction[]>>;
  deleteWalletTransaction(id: string): Promise<void>;

  createWalletWithdrawalRequest(
    request: Partial<WalletWithDrawalRequest>,
  ): Promise<WalletWithDrawalRequest>;
  updateWalletWithdrawalRequest(
    id: string,
    request: Partial<WalletWithDrawalRequest>,
  ): Promise<WalletWithDrawalRequest>;
  findWalletWithdrawalRequestById(id: string): Promise<WalletWithDrawalRequest>;
  findWalletWithdrawalRequestsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>>;
  deleteWalletWithdrawalRequest(id: string): Promise<void>;
}
