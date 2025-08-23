import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWalletTransactionByIdQuery } from "../find-wallet-transaction-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository } from "@/core/domain/wallet";

@QueryHandler(FindWalletTransactionByIdQuery)
export class FindWalletTransactionByIdHandler
  implements IQueryHandler<FindWalletTransactionByIdQuery>
{
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}
  async execute(query: FindWalletTransactionByIdQuery): Promise<any> {
    return this.walletRepository.findWalletTransactionById(query.id);
  }
}
