import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindWithdrawalRequestByIdQuery } from "../find-withdrawal-request-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository } from "@/core/domain/wallet";

@QueryHandler(FindWithdrawalRequestByIdQuery)
export class FindWithdrawalRequestByIdHandler implements IQueryHandler<FindWithdrawalRequestByIdQuery> {
  constructor(
      @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
  ) {}

  execute(query: FindWithdrawalRequestByIdQuery): Promise<any> {
    const { id } = query;
    return this.walletRepository.findWalletWithdrawalRequestById(id);
  }

}