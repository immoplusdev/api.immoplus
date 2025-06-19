import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IWalletRepository } from '@/core/domain/wallet';
import { Deps } from '@/core/domain/common/ioc';
import { FindWalletByIdQuery } from '../find-wallet-by-id.query';

@QueryHandler(FindWalletByIdQuery)
export class FindWalletByIdQueryHandler implements IQueryHandler<FindWalletByIdQuery> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
    execute(query: FindWalletByIdQuery) {
        return this.walletRepository.findWithdrawalRequestById(query.id);
    }   
}
