import { UserRole } from '@/core/domain/roles';
import { DEFAULT_CURRENCY, TransactionSource, Wallet, WalletTransaction, WalletWithDrawalRequest, WithdrawalStatus } from '@/core/domain/wallet';
import { CurrentUser, RequiredRoles } from '@/infrastructure/decorators';
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
import { devNull } from 'os';


@ApiTags("Wallet")
@Controller('wallet')
export class WalletsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        
    }

    // Define your controller methods here, for example:
    @Get('my-wallet')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getWalletByOwner(@CurrentUser("id") userId: string) {
        return this.queryBus.execute(new FindWalletByOwnerQuery(userId));
    }

    @Post('admin/credit')
    @RequiredRoles(UserRole.Admin)
    // @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async creditWallet(@Body() data: CreditWalletDto): Promise<Wallet> {
        return this.commandBus.execute(new CreditWalletCommand(
            data.ownerId,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.source,
            data.sourceId,
            data.operator,
            data.note,
            data.refundDate
        ));
    }

    @Post('admin/debit')
    // @RequiredRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async debitWallet(@Body() data: DebitWalletDto): Promise<Wallet> {
        return this.commandBus.execute(new DebitWalletCommand(
            data.ownerId,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.source,
            data.sourceId,
            data.operator,
            data.note
        ));
    }

    @Post('admin/release-funds')
    // @RequiredRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async releaseFunds(@Body() data: ReleaseFundsDto): Promise<Wallet> {
        return this.commandBus.execute(new ReleaseFundsCommand(
            data.ownerId,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.source|| TransactionSource.AUTRE,
            data.sourceId,
            data.note
        ));
    }

    @Get('transaction/:id')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletTransactionById(@Param('id') id: string): Promise<WalletTransaction> {
        return this.queryBus.execute(new FindWalletTransactionByIdQuery(id));
    }

    @Get('my-transactions')
    @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletTransactionsByOwner(@CurrentUser("id") userId: string): Promise<WalletTransaction> {
        return this.queryBus.execute(new FindWalletTransactionsByOwnerQuery(userId));
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
    async createWalletWithdrawalRequest(@CurrentUser("id") userId: string, @Body() data: CreateWalletWithdrawalRequestDto): Promise<WalletWithDrawalRequest> 
    {
        return this.commandBus.execute(new CreateWalletWithdrawalRequestCommand(
            userId,
            data.amount,
            data.currency || DEFAULT_CURRENCY,
            data.phoneNumber,
            data.operator,
            WithdrawalStatus.PENDING,
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
            data.phoneNumber,
            data.operator,
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

    @Get('my-withdrawal-request')
    @RequiredRoles(UserRole.Admin,  UserRole.ProEntreprise, UserRole.ProParticulier)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findWalletWithdrawalRequestsByOwner(@CurrentUser("id") userId: string,): Promise<WalletWithDrawalRequest[]> 
    {
        return this.queryBus.execute(new FindWalletWithdrawalRequestsByOwnerQuery(userId));
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
