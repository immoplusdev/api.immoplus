import { Inject, Query } from "@nestjs/common";
import { FindWalletByOwnerQuery } from "../find-wallet-by-owner.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository } from "@/core/domain/wallet";

@QueryHandler(FindWalletByOwnerQuery)
export class FindWalletByOwnerQueryHandler implements IQueryHandler<FindWalletByOwnerQuery> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
  execute(query: FindWalletByOwnerQuery): Promise<any> {
    return this.walletRepository.findWalletByOwner(query.ownerId);
  }
}