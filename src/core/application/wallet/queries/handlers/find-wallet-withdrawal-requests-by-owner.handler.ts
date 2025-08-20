import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWalletWithdrawalRequestsByOwnerQuery } from "../find-wallet-withdrawal-requests-by-owner.query";
import { Inject } from "@nestjs/common";
import {
  IWalletRepository,
  WalletWithDrawalRequest,
} from "@/core/domain/wallet";
import { Deps } from "@/core/domain/common/ioc";
import { WrapperResponse } from "@/core/domain/common/models";

@QueryHandler(FindWalletWithdrawalRequestsByOwnerQuery)
export class FindWithdrawalRequestsByOwnerHandler
  implements IQueryHandler<FindWalletWithdrawalRequestsByOwnerQuery>
{
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(
    findWalletWithdrawalRequestsByOwnerQuery: FindWalletWithdrawalRequestsByOwnerQuery,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
    return await this.walletRepository.findWalletWithdrawalRequestsByOwner(
      findWalletWithdrawalRequestsByOwnerQuery.query,
    );
  }
}
