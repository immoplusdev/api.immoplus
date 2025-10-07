import {
  DEFAULT_CURRENCY,
  IWalletRepository,
  TransactionSource,
  Wallet,
  WalletTransaction,
  WalletWithDrawalRequest,
} from "@/core/domain/wallet";
import { WalletsService } from "./wallet.service";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { CreateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/create-wallet-withdrawal-request.command";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/common/models";
import { PaymentMethod } from "@/core/domain/common/enums";

export class WalletsRepository implements IWalletRepository {
  constructor(
    @Inject(Deps.WalletsService) private readonly walletService: WalletsService,
  ) {}

  findWalletByOwner(ownerId: string): Promise<Wallet> {
    return this.walletService.findWalletByOwner(ownerId);
  }

  creditWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source?: TransactionSource,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
    releaseDate?: Date,
  ): Promise<Wallet> {
    return this.walletService.creditWallet(
      ownerId,
      amount,
      currency,
      source,
      sourceId,
      operator,
      note,
      releaseDate,
    );
  }
  debitWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source?: TransactionSource,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
  ): Promise<Wallet> {
    return this.walletService.debitWallet(
      ownerId,
      amount,
      currency,
      source,
      sourceId,
      operator,
      note,
    );
  }

  releaseFunds(
    ownerId: string,
    amount: number,
    currency = DEFAULT_CURRENCY,
    source?: TransactionSource,
    sourceId?: string,
    note?: string,
  ): Promise<Wallet> {
    return this.walletService.releaseFunds(
      ownerId,
      amount,
      currency,
      source,
      sourceId,
      note,
    );
  }

  findWalletTransactionById(id: string): Promise<WalletTransaction> {
    return this.walletService.findWalletTransactionById(id);
  }

  findWalletTransactionsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletTransaction[]>> {
    return this.walletService.findWalletTransactionsByOwner(query);
  }

  deleteWalletTransaction(id: string): Promise<void> {
    return this.walletService.deleteWalletTransaction(id);
  }

  createWalletWithdrawalRequest(
    request: CreateWalletWithdrawalRequestCommand,
  ): Promise<WalletWithDrawalRequest> {
    return this.walletService.createWalletWithdrawalRequest(request);
  }
  updateWalletWithdrawalRequest(
    id: string,
    request: Partial<WalletWithDrawalRequest>,
  ): Promise<WalletWithDrawalRequest> {
    return this.walletService.updateWalletWithdrawalRequest(id, request);
  }
  findWalletWithdrawalRequestById(
    id: string,
  ): Promise<WalletWithDrawalRequest> {
    return this.walletService.findWalletWithdrawalRequestById(id);
  }
  findWalletWithdrawalRequestsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
    return this.walletService.findWalletWithdrawalRequestsByOwner(query);
  }
  deleteWalletWithdrawalRequest(id: string): Promise<void> {
    return this.walletService.deleteWalletWithdrawalRequest(id);
  }

  setPinCode(ownerId: string, pin: string): Promise<void> {
    return this.walletService.setPinCode(ownerId, pin);
  }

  verifyPinCode(ownerId: string, pin: string): Promise<boolean> {
    return this.walletService.verifyPinCode(ownerId, pin);
  }

  hasPinCode(ownerId: string): Promise<boolean> {
    return this.walletService.hasPinCode(ownerId);
  }
}
