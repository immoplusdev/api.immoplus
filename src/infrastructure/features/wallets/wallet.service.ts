import { Deps } from "@/core/domain/common/ioc";
import {
  DEFAULT_CURRENCY,
  TransactionSource,
  TransactionType,
  Wallet,
  WalletTransaction,
  WalletWithDrawalRequest,
} from "@/core/domain/wallet";
import { BaseRepository } from "@/infrastructure/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { WalletEntity } from "./wallet.entity";
import { CreateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/create-wallet-withdrawal-request.command";
import { WalletTransactionEntity } from "./wallet-transaction.entity";
import { NotEnoughtMoneyException } from "@/core/domain/wallet/exceptions/not-enought-money.exception";
import { WalletWithdrawalRequestEntity } from "./wallet-withdrawal-request.entity";
import { WrapperResponse } from "@/core/domain/common/models";
import { SearchItemsParams } from "@/core/domain/http";
import { PaymentMethod } from "@/core/domain/common/enums";
import { Reservation } from "@/core/domain/reservations";
import { ReservationEntity } from "../reservations";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as bcrypt from "bcrypt";

@Injectable()
export class WalletsService {
  private readonly walletRepo: BaseRepository<Wallet>;
  private readonly walletTransactionRepo: BaseRepository<WalletTransaction>;
  private readonly walletWithdrawalRepo: BaseRepository<WalletWithDrawalRequest>;
  private readonly reservationRepo: BaseRepository<Reservation>;
  constructor(@Inject(Deps.DataSource) readonly dataSource: DataSource) {
    this.walletRepo = new BaseRepository(
      dataSource,
      WalletEntity,
    ).setLoadRelationIds(false);
    this.walletTransactionRepo = new BaseRepository(
      dataSource,
      WalletTransactionEntity,
    ).setLoadRelationIds(true);
    this.walletWithdrawalRepo = new BaseRepository(
      dataSource,
      WalletWithdrawalRequestEntity,
    ).setLoadRelationIds(true);
    this.reservationRepo = new BaseRepository(
      dataSource,
      ReservationEntity,
    ).setLoadRelationIds(true);
  }

  async findWalletByOwner(ownerId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOneByQuery({
      _where: [
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
        currency: DEFAULT_CURRENCY,
      });
    }

    return wallet;
  }

  async creditWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source = TransactionSource.AUTRE,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
    releaseDate?: Date,
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
      releaseDate,
    });

    await this.walletRepo.updateOne(wallet.id, {
      pendingBalance: pendingBalance,
    });

    if (source == TransactionSource.RESERVATION) {
      await this.reservationRepo.updateOne(sourceId, { proReverse: true });
    }
    return this.findWalletByOwner(ownerId);
  }

  async debitWallet(
    ownerId: string,
    amount: number,
    currency?: string,
    source = TransactionSource.AUTRE,
    sourceId?: string,
    operator?: PaymentMethod,
    note?: string,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByOwner(ownerId);
    if (wallet.availableBalance < amount) {
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
      note: note || "Débit du compte",
      createdBy: ownerId,
    });

    await this.walletRepo.updateOne(wallet.id, {
      availableBalance: newAvailableBalance,
    });

    return await this.findWalletByOwner(ownerId);
  }

  async releaseFunds(
    ownerId: string,
    amount: number,
    currency = DEFAULT_CURRENCY,
    source?: TransactionSource,
    sourceId?: string,
    note?: string,
  ): Promise<Wallet> {
    const wallet = await this.findWalletByOwner(ownerId);

    if (wallet.pendingBalance < amount) {
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
        note: note || "Déblocage suite à fin de réservation",
        createdBy: ownerId,
      },
      {
        wallet,
        type: TransactionType.CREDIT,
        amount,
        currency,
        source,
        sourceId,
        note: note || "Crédit du compte disponible",
        createdBy: ownerId,
      },
    ]);

    const transaction = await this.walletTransactionRepo.findOneByQuery({
      _where: [
        {
          _field: "wallet",
          _op: "eq",
          _val: wallet.id,
        },
        {
          _field: "type",
          _op: "eq",
          _val: TransactionType.BLOCK,
        },
        {
          _field: "isRealeased",
          _op: "eq",
          _val: false,
        },
        {
          _field: "amount",
          _op: "eq",
          _val: amount,
        },
      ],
    });

    if (!transaction) {
      await this.walletTransactionRepo.updateOne(transaction.id, {
        isRealeased: true,
        releasedAt: new Date(),
      });
    }

    await this.walletRepo.updateOne(wallet.id, {
      pendingBalance,
      availableBalance,
    });

    if (source == TransactionSource.RESERVATION) {
      await this.reservationRepo.updateOne(sourceId, {
        retraitProEffectue: true,
      });
    }
    return this.findWalletByOwner(ownerId);
  }

  async findWalletTransactionById(id: string): Promise<WalletTransaction> {
    const transaction = await this.walletTransactionRepo.findOne(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  }

  async findWalletTransactionsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletTransaction[]>> {
    return this.walletTransactionRepo.findByQuery(query);
  }

  async deleteWalletTransaction(id: string): Promise<void> {
    await this.walletTransactionRepo.deleteOne(id);
  }

  async createWalletWithdrawalRequest(
    request: CreateWalletWithdrawalRequestCommand,
  ): Promise<WalletWithDrawalRequest> {
    const wallet = await this.findWalletByOwner(request.owner);
    if (wallet.availableBalance < +request.amount) {
      throw new NotEnoughtMoneyException();
    }
    const newRequest = new WalletWithDrawalRequest({
      ...request,
      wallet,
    });

    return this.walletWithdrawalRepo.createOne(newRequest);
  }

  async updateWalletWithdrawalRequest(
    id: string,
    request: Partial<WalletWithDrawalRequest>,
  ): Promise<WalletWithDrawalRequest> {
    await this.walletWithdrawalRepo.updateOne(id, request);
    return this.walletWithdrawalRepo.findOne(id);
  }

  async findWalletWithdrawalRequestById(
    id: string,
  ): Promise<WalletWithDrawalRequest> {
    const walletWithdrawal = await this.walletWithdrawalRepo.findOne(id);
    return walletWithdrawal;
  }

  async findWalletWithdrawalRequestsByOwner(
    query: SearchItemsParams,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
    return this.walletWithdrawalRepo.findByQuery(query);
  }

  async deleteWalletWithdrawalRequest(id: string): Promise<void> {
    await this.walletWithdrawalRepo.deleteOne(id);
  }

  /**
   * This function is used to verify and make refund of blocked transactions.
   * It get all blocked transactions that are not released and have a release date
   * that is lower than the current date.
   * Then it update the wallet by decreasing the pending balance and increasing the available balance
   * and create two new transactions : one for unblocking the funds and one for crediting the available balance.
   * Finally it update the transaction to be released.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async verifyAndMakeRefund() {
    const transactions = await this.walletTransactionRepo.findByQuery({
      _where: [
        {
          _field: "type",
          _op: "eq",
          _val: TransactionType.BLOCK,
        },
        {
          _field: "isRealeased",
          _op: "eq",
          _val: false,
        },
        {
          _field: "releasedAt",
          _op: "eq",
          _val: null,
        },
      ],
    });

    await transactions.data.forEach(async (transaction) => {
      if (transaction.releaseDate && new Date() >= transaction.releaseDate) {
        const walletId =
          typeof transaction.wallet === "string"
            ? transaction.wallet
            : transaction.wallet.id;
        const wallet = await this.walletRepo.findOne(walletId);
        if (wallet && wallet.pendingBalance >= transaction.amount) {
          const pendingBalance = +wallet.pendingBalance - transaction.amount;
          const availableBalance =
            +wallet.availableBalance + transaction.amount;

          /* Enregistrement des transactions **/
          await this.walletTransactionRepo.createMany([
            {
              wallet,
              type: TransactionType.UNBLOCK,
              amount: transaction.amount,
              currency: transaction.currency,
              source: transaction.source,
              sourceId: transaction.sourceId,
              note: "Déblocage des fonds",
              createdBy: null,
            },
            {
              wallet,
              type: TransactionType.CREDIT,
              amount: transaction.amount,
              currency: transaction.currency,
              source: transaction.source,
              sourceId: transaction.sourceId,
              note: "Versement des fonds sur compte disponible",
              createdBy: null,
            },
          ]);

          /* Mise a jour du portefeuille **/
          await this.walletRepo.updateOne(wallet.id, {
            pendingBalance,
            availableBalance,
          });
          await this.walletTransactionRepo.updateOne(transaction.id, {
            isRealeased: true,
            releasedAt: new Date(),
          });
          if (transaction.source === TransactionSource.RESERVATION)
            await this.reservationRepo.updateOne(transaction.sourceId, {
              retraitProEffectue: true,
            });
        }
      }
    });
  }

  async setPinCode(ownerId: string, pin: string): Promise<void> {
    const wallet = await this.findWalletByOwner(ownerId);
    const saltRounds = 10;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    await this.walletRepo.updateOne(wallet.id, { pinHash });
  }

  async verifyPinCode(ownerId: string, pin: string): Promise<boolean> {
    const wallet = await this.findWalletByOwner(ownerId);

    if (!wallet.pinHash) {
      return false;
    }

    return await bcrypt.compare(pin, wallet.pinHash);
  }

  async hasPinCode(ownerId: string): Promise<boolean> {
    const wallet = await this.findWalletByOwner(ownerId);
    return !!wallet.pinHash;
  }
}
