import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWalletTransactionsByOwnerQuery } from "../find-wallet-transactions-by-owner.query";
import { IWalletRepository, WalletTransaction } from "@/core/domain/wallet";
import { Deps } from "@/core/domain/common/ioc";
import { Inject } from "@nestjs/common";

@QueryHandler(FindWalletTransactionsByOwnerQuery)
export class FindWalletTransactionByOwnerHandler implements IQueryHandler<FindWalletTransactionsByOwnerQuery>{

    constructor(
         @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ){}
    async execute(query: FindWalletTransactionsByOwnerQuery): Promise<WalletTransaction[]>{ 
        const { ownerId } = query;
        return this.walletRepository.findWalletTransactionsByOwner(ownerId);
    }
}