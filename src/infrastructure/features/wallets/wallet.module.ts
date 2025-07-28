import { Module, Provider } from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { WalletsController } from './wallet.controller';
import { TypeormModule } from '@/infrastructure/typeorm';
import { Deps } from '@/core/domain/common/ioc';
import { WalletsRepository } from './wallet-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { FindWalletByOwnerHandler } from '@/core/application/wallet/queries/handlers/find-wallet-by-owner.handler';
import { CreditWalletCommand } from '@/core/application/wallet/commands/credit-wallet.command';
import { DebitWalletCommand } from '@/core/application/wallet/commands/debit-wallet.command';
import { ReleaseFundsCommand } from '@/core/application/wallet/commands/release-funds.command';
import { FindWalletTransactionByIdQuery } from '@/core/application/wallet/queries/find-wallet-transaction-by-id.query';
import { FindWalletTransactionsByOwnerQuery } from '@/core/application/wallet/queries/find-wallet-transactions-by-owner.query';
import { DeleteWalletTransactionCommand } from '@/core/application/wallet/commands/delete-wallet-transaction.command';
import { CreateWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/create-wallet-withdrawal-request.command';
import { UpdateWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/update-wallet-withdrawal-request.command';
import { FindWalletWithdrawalRequestsByOwnerQuery } from '@/core/application/wallet/queries/find-wallet-withdrawal-requests-by-owner.query';
import { DeleteWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/delete-wallet-withdrawal-request.command';
import { CreditWalletHandler } from '@/core/application/wallet/commands/handlers/credit-wallet.handler';
import { DebitWalletHandler } from '@/core/application/wallet/commands/handlers/debit-wallet.handler';
import { ReleaseFundsHandler } from '@/core/application/wallet/commands/handlers/release-funds.handler';
import { FindWalletTransactionByIdHandler } from '@/core/application/wallet/queries/handlers/find-wallet-transaction-by-id.handler';
import { FindWalletTransactionByOwnerHandler } from '@/core/application/wallet/queries/handlers/find-wallet-transaction-by-owner.handler';
import { DeleteWalletTransactionHandler } from '@/core/application/wallet/commands/handlers/delete-wallet-transaction.handler';
import { CreateWalletWithdrawalRequestHandler } from '@/core/application/wallet/commands/handlers/create-wallet-withdrawal-request.handler';
import { UpdateWalletWithdrawalRequestHandler } from '@/core/application/wallet/commands/handlers/update-wallet-withdrawal-request.handler';
import { FindWithdrawalRequestByIdQuery } from '@/core/application/wallet/queries/find-withdrawal-request-by-id.query';
import { FindWithdrawalRequestByIdHandler } from '@/core/application/wallet/queries/handlers/find-withdrawal-request-by-id.handler';
import { FindWithdrawalRequestsByOwnerHandler } from '@/core/application/wallet/queries/handlers/find-wallet-withdrawal-requests-by-owner.handler';
import { DeleteWalletWithdrawalRequestHandler } from '@/core/application/wallet/commands/handlers/delete-wallet-withdrawal-request.handler';
import { ReservationModule } from '../reservations';

const providers: Provider[] = [
    {
        provide: Deps.WalletRepository,
        useClass: WalletsRepository,
    },
    {
        provide: Deps.WalletsService,
        useClass: WalletsService,
    },
    FindWalletByOwnerHandler,
    CreditWalletCommand,
    CreditWalletHandler,
    DebitWalletCommand,
    DebitWalletHandler,
    ReleaseFundsCommand,
    ReleaseFundsHandler,
    FindWalletTransactionByIdQuery,
    FindWalletTransactionByIdHandler,
    FindWalletTransactionsByOwnerQuery,
    FindWalletTransactionByOwnerHandler,
    DeleteWalletTransactionCommand,
    DeleteWalletTransactionHandler,
    CreateWalletWithdrawalRequestCommand,
    CreateWalletWithdrawalRequestHandler,
    UpdateWalletWithdrawalRequestCommand,
    UpdateWalletWithdrawalRequestHandler,
    FindWalletWithdrawalRequestsByOwnerQuery,
    FindWithdrawalRequestsByOwnerHandler,
    DeleteWalletWithdrawalRequestCommand,
    DeleteWalletWithdrawalRequestHandler,
    FindWithdrawalRequestByIdQuery,
    FindWithdrawalRequestByIdHandler,
    ReservationModule
];
@Module({
    imports: [TypeormModule, CqrsModule],
    providers: [
        ...providers,
    ],
    controllers: [WalletsController],
    exports: [...providers],
})
export class WalletModule {}
