import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWalletTransactionsQuery } from "../find-wallet-transactions.query";
import { IWalletRepository } from "@/core/domain/wallet";
import { Deps } from "@/core/domain/common/ioc";
import { Inject } from "@nestjs/common";

@QueryHandler(FindWalletTransactionsQuery)
export class FindWalletTransactionsQueryHandler implements IQueryHandler<FindWalletTransactionsQuery> {
  constructor(
    @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
  ) {}

  async execute(query: FindWalletTransactionsQuery): Promise<any> { // Replace 'any' with the actual return type
    const { walletId } = query;
    return this.walletRepository.findWalletTransactionById(walletId);
  }
}