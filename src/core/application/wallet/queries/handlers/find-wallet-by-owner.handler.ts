import { Inject, Query } from "@nestjs/common";
import { FindWalletByOwnerQuery } from "../find-wallet-by-owner.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, Wallet } from "@/core/domain/wallet";

@QueryHandler(FindWalletByOwnerQuery)
export class FindWalletByOwnerHandler implements IQueryHandler<FindWalletByOwnerQuery> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
  execute(query: FindWalletByOwnerQuery): Promise<Wallet> {
    console.log("FindWalletByOwnerHandler: ", query);
    return this.walletRepository.findWalletByOwner(query.ownerId);
  }
}