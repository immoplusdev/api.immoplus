import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HasPinQuery } from "../has-pin.query";
import { IWalletRepository } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@QueryHandler(HasPinQuery)
export class HasPinHandler implements IQueryHandler<HasPinQuery> {
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(query: HasPinQuery): Promise<boolean> {
    return this.walletRepository.hasPinCode(query.ownerId);
  }
}