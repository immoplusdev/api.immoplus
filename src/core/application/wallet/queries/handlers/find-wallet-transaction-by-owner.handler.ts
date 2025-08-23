import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWalletTransactionsByOwnerQuery } from "../find-wallet-transactions-by-owner.query";
import { IWalletRepository, WalletTransaction } from "@/core/domain/wallet";
import { Deps } from "@/core/domain/common/ioc";
import { Inject } from "@nestjs/common";
import { WrapperResponse } from "@/core/domain/common/models";

@QueryHandler(FindWalletTransactionsByOwnerQuery)
export class FindWalletTransactionByOwnerHandler
  implements IQueryHandler<FindWalletTransactionsByOwnerQuery>
{
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}
  async execute(
    findWalletTransactionsByOwnerQuery: FindWalletTransactionsByOwnerQuery,
  ): Promise<WrapperResponse<WalletTransaction[]>> {
    return this.walletRepository.findWalletTransactionsByOwner(
      findWalletTransactionsByOwnerQuery.query,
    );
  }
}
