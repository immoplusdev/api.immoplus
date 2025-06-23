import { Deps } from '@/core/domain/common/ioc';
import { PermissionAction, PermissionCollection } from '@/core/domain/permissions';
import { UserRole } from '@/core/domain/roles';
import { DEFAULT_CURRENCY, IWalletRepository, Wallet, WalletTransaction, WalletWithDrawalRequest } from '@/core/domain/wallet';
import { RequiredPermissions, RequiredRoles } from '@/infrastructure/decorators';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindWalletByOwnerQuery } from '@/core/application/wallet/queries/find-wallet-by-owner.query';
import { CreditWalletDto } from './dtos/credit-wallet.dto';
import { CreditWalletCommand } from '@/core/application/wallet/commands/credit-wallet.command';
import { DebitWalletDto } from './dtos/debit-wallet.dto';
import { DebitWalletCommand } from '@/core/application/wallet/commands/debit-wallet.command';
import { ReleaseFundsDto } from './dtos/release-funds.dto';
import { ReleaseFundsCommand } from '@/core/application/wallet/commands/release-funds.command';
import { FindWalletTransactionByIdQuery } from '@/core/application/wallet/queries/find-wallet-transaction-by-id.query';
import { FindWalletTransactionsByOwnerQuery } from '@/core/application/wallet/queries/find-wallet-transactions-by-owner.query';
import { DeleteWalletTransactionCommand } from '@/core/application/wallet/commands/delete-wallet-transaction.command';
import { CreateWalletWithdrawalRequestDto } from './dtos/create-wallet-withdrawal-request';
import { CreateWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/create-wallet-withdrawal-request.command';
import { UpdateWalletWithdrawalRequestDto } from './dtos/update-wallet-withdrawal-request';
import { UpdateWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/update-wallet-withdrawal-request.command';
import { FindWalletWithdrawalRequestsByOwnerQuery } from '@/core/application/wallet/queries/find-wallet-withdrawal-requests-by-owner.query';
import { DeleteWalletWithdrawalRequestCommand } from '@/core/application/wallet/commands/delete-wallet-withdrawal-request.command';
import { FindWithdrawalRequestByIdQuery } from '@/core/application/wallet/queries/find-withdrawal-request-by-id.query';


@ApiTags("Wallet")
@Controller('wallet')
export class WalletsController {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        
    }

    // Define your controller methods here, for example:
    @Get('owner/:owner')
    @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
    @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Update])
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getWalletByOwner(@Param('owner') owner: string) {
        return this.queryBus.execute(new FindWalletByOwnerQuery(owner));
    }

    @Post('credit')
    @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
    @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Update])
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async creditWallet(@Body() data: CreditWalletDto): Promise<Wallet> {
        return this.commandBus.execute(new CreditWalletCommand(
            data.ownerId,
            data.amount,
            data.reservationId,
            data.currency || DEFAULT_CURRENCY
        ));
    }

    @Post('debit')
    @RequiredRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async debitWallet(@Body() data: DebitWalletDto): Promise<Wallet> {
        return this.commandBus.execute(new DebitWalletCommand(
            data.ownerId,
            data.amount,
            data.reservationId,
            data.currency || DEFAULT_CURRENCY
        ));
    }

    @Post('release-funds')
    @RequiredRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async releaseFunds(@Body() data: ReleaseFundsDto): Promise<Wallet> {
        return this.commandBus.execute(new ReleaseFundsCommand(
            data.ownerId,
            data.amount,
            data.reservationId,
            data.currency || DEFAULT_CURRENCY
        ));
    }

    @Get('transaction/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletTransactionById(@Param('id') id: string): Promise<WalletTransaction> {
        return this.queryBus.execute(new FindWalletTransactionByIdQuery(id));
    }

    @Get('transaction/owner/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletTransactionsByOwner(@Param('id') id: string): Promise<WalletTransaction> {
        return this.queryBus.execute(new FindWalletTransactionsByOwnerQuery(id));
    }

    @Delete('transaction/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteWalletTransaction(@Param('id') id: string): Promise<WalletTransaction> 
    {
        return this.commandBus.execute(new DeleteWalletTransactionCommand(id));
    }

    @Post('withdrawal-request/create')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createWalletWithdrawalRequest(@Body() data: CreateWalletWithdrawalRequestDto): Promise<WalletWithDrawalRequest> 
    {
        return this.commandBus.execute(new CreateWalletWithdrawalRequestCommand(
            data.owner,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.status,
            data.note
        ));
    }

    @Put('withdrawal-request/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateWalletWithdrawalRequest(@Param('id') id: string, @Body() data: UpdateWalletWithdrawalRequestDto): Promise<WalletWithDrawalRequest> 
    {
        return this.commandBus.execute(new UpdateWalletWithdrawalRequestCommand(
            id,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.status,
            data.note
        ));
    }


    @Get('withdrawal-request/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletWithdrawalRequestById(@Param('id') id: string): Promise<WalletWithDrawalRequest> 
    {
        return this.queryBus.execute(new FindWithdrawalRequestByIdQuery(id));
    }

    @Get('withdrawal-request/owner/:id')
    @RequiredRoles(UserRole.Admin,  UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletWithdrawalRequestsByOwner(@Param('id') id: string): Promise<WalletWithDrawalRequest[]> 
    {
        return this.queryBus.execute(new FindWalletWithdrawalRequestsByOwnerQuery(id));
    }

    @Delete('withdrawal-request/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteWalletWithdrawalRequest(@Param('id') id: string): Promise<void> 
    {
        return this.commandBus.execute(new DeleteWalletWithdrawalRequestCommand(id));
    }

}
