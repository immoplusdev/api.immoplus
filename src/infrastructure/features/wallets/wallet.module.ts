import { Module, Provider } from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { WalletsController } from './wallet.controller';
import { TypeormModule } from '@/infrastructure/typeorm';
import { Deps } from '@/core/domain/common/ioc';
import { WalletsRepository } from './wallet-repository';

const providers: Provider[] = [
    {
        provide: Deps.WalletRepository,
        useClass: WalletsRepository,
    },
    {
        provide: Deps.WalletsService,
        useClass: WalletsService,
    }
];
@Module({
    imports: [TypeormModule],
    providers: [...providers],
    controllers: [WalletsController],
    exports: [...providers],
})
export class WalletsModule {}
