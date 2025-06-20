import { Deps } from '@/core/domain/common/ioc';
import { IWalletRepository } from '@/core/domain/wallet';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('wallet')
export class WalletsController {
    constructor(@Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository) {}

    // Define your controller methods here, for example:
    @Get('/owner/:ownerId')
    async getWalletByOwner(ownerId: string) {
        return this.walletRepository.findWalletByOwner(ownerId);
    }


}
