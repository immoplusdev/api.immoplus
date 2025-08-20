import { UserRole } from "@/core/domain/roles";
import {
  DEFAULT_CURRENCY,
  TransactionSource,
  WalletTransaction,
  WalletWithDrawalRequest,
  WithdrawalStatus,
} from "@/core/domain/wallet";
import { CurrentUser, RequiredRoles } from "@/infrastructure/decorators";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindWalletByOwnerQuery } from "@/core/application/wallet/queries/find-wallet-by-owner.query";
import { CreditWalletDto } from "./dtos/credit-wallet.dto";
import { CreditWalletCommand } from "@/core/application/wallet/commands/credit-wallet.command";
import { DebitWalletDto } from "./dtos/debit-wallet.dto";
import { DebitWalletCommand } from "@/core/application/wallet/commands/debit-wallet.command";
import { ReleaseFundsDto } from "./dtos/release-funds.dto";
import { ReleaseFundsCommand } from "@/core/application/wallet/commands/release-funds.command";
import { FindWalletTransactionByIdQuery } from "@/core/application/wallet/queries/find-wallet-transaction-by-id.query";
import { FindWalletTransactionsByOwnerQuery } from "@/core/application/wallet/queries/find-wallet-transactions-by-owner.query";
import { DeleteWalletTransactionCommand } from "@/core/application/wallet/commands/delete-wallet-transaction.command";
import { CreateWalletWithdrawalRequestDto } from "./dtos/create-wallet-withdrawal-request";
import { CreateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/create-wallet-withdrawal-request.command";
import { UpdateWalletWithdrawalRequestDto } from "./dtos/update-wallet-withdrawal-request";
import { UpdateWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/update-wallet-withdrawal-request.command";
import { FindWalletWithdrawalRequestsByOwnerQuery } from "@/core/application/wallet/queries/find-wallet-withdrawal-requests-by-owner.query";
import { DeleteWalletWithdrawalRequestCommand } from "@/core/application/wallet/commands/delete-wallet-withdrawal-request.command";
import { FindWithdrawalRequestByIdQuery } from "@/core/application/wallet/queries/find-withdrawal-request-by-id.query";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { WrapperResponse } from "@/core/domain/common/models";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  WrapperResponseWalletWithdrawalRequestBatchDto,
  WrapperResponseWalletWithdrawalRequestDto,
} from "./dtos/wallet-wallet-withdrawal-request.dto";
import {
  WrapperResponseWalletTransactionbatchDto,
  WrapperResponseWalletTransactionDto,
} from "./dtos/wallet-transaction.dto";
import { WrapperResponseWalletDto } from "./dtos/wallet.dto";

@ApiTags("Wallet")
@Controller("wallet")
export class WalletsController {
  private readonly responseMapper = new WrapperResponseDtoMapper();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiResponse({
    type: WrapperResponseWalletDto,
  })
  @Get("my-wallet")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getWalletByOwner(@CurrentUser("id") userId: string) {
    const response = await this.queryBus.execute(
      new FindWalletByOwnerQuery(userId),
    );
    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletDto,
  })
  @Get("admin/user-wallet/:userId")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserWallet(@Param("userId") userId: string) {
    const response = await this.queryBus.execute(
      new FindWalletByOwnerQuery(userId),
    );
    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletDto,
  })
  @Post("admin/credit")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async creditWallet(@Body() data: CreditWalletDto) {
    const response = await this.commandBus.execute(
      new CreditWalletCommand(
        data.ownerId,
        data.amount,
        data.currency || DEFAULT_CURRENCY,
        data.source,
        data.sourceId,
        data.operator,
        data.note,
        data.refundDate,
      ),
    );

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletDto,
  })
  @Post("admin/debit")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async debitWallet(@Body() data: DebitWalletDto) {
    const response = await this.commandBus.execute(
      new DebitWalletCommand(
        data.ownerId,
        data.amount,
        data.currency || DEFAULT_CURRENCY,
        data.source,
        data.sourceId,
        data.operator,
        data.note,
      ),
    );

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletDto,
  })
  @Post("admin/release-funds")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async releaseFunds(@Body() data: ReleaseFundsDto) {
    const response = await this.commandBus.execute(
      new ReleaseFundsCommand(
        data.ownerId,
        data.amount,
        data.currency || DEFAULT_CURRENCY,
        data.source || TransactionSource.AUTRE,
        data.sourceId,
        data.note,
      ),
    );

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletTransactionDto,
  })
  @Get("transaction/:id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findWalletTransactionById(@Param("id") id: string) {
    const response = await this.queryBus.execute(
      new FindWalletTransactionByIdQuery(id),
    );
    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseWalletTransactionbatchDto,
  })
  @Get("my-transactions")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findWalletTransactionsByOwner(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
  ): Promise<WalletTransaction> {
    const wallet = await this.queryBus.execute(
      new FindWalletByOwnerQuery(userId),
    );
    params._where = addConditionsToWhereClause(
      [
        {
          _field: "wallet",
          _op: "eq",
          _val: wallet.id,
        },
      ],
      params._where,
    );
    return this.queryBus.execute(
      new FindWalletTransactionsByOwnerQuery(params),
    );
  }

  @ApiResponse({
    type: WrapperResponseWalletTransactionbatchDto,
  })
  @Get("admin/wallet-transactions/:userId")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findUsersWalletTransactions(
    @Query() params: SearchItemsParamsDto,
    @Param("userId") userId: string,
  ): Promise<WalletTransaction> {
    const wallet = await this.queryBus.execute(
      new FindWalletByOwnerQuery(userId),
    );
    params._where = addConditionsToWhereClause(
      [
        {
          _field: "wallet",
          _op: "eq",
          _val: wallet.id,
        },
      ],
      params._where,
    );
    return this.queryBus.execute(
      new FindWalletTransactionsByOwnerQuery(params),
    );
  }

  @Delete("transaction/:id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteWalletTransaction(
    @Param("id") id: string,
  ): Promise<WalletTransaction> {
    return this.commandBus.execute(new DeleteWalletTransactionCommand(id));
  }

  @ApiResponse({
    type: WrapperResponseWalletWithdrawalRequestDto,
  })
  @Post("withdrawal-request/create")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createWalletWithdrawalRequest(
    @CurrentUser("id") userId: string,
    @Body() data: CreateWalletWithdrawalRequestDto,
  ): Promise<WalletWithDrawalRequest> {
    return this.commandBus.execute(
      new CreateWalletWithdrawalRequestCommand(
        userId,
        data.amount,
        data.currency || DEFAULT_CURRENCY,
        data.phoneNumber,
        data.operator,
        WithdrawalStatus.PENDING,
        data.note,
      ),
    );
  }

  @ApiResponse({
    type: WrapperResponseWalletWithdrawalRequestDto,
  })
  @Put("withdrawal-request/:id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateWalletWithdrawalRequest(
    @Param("id") id: string,
    @Body() data: UpdateWalletWithdrawalRequestDto,
  ): Promise<WalletWithDrawalRequest> {
    return this.commandBus.execute(
      new UpdateWalletWithdrawalRequestCommand(
        id,
        data.amount,
        data.currency || DEFAULT_CURRENCY,
        data.phoneNumber,
        data.operator,
        data.status,
        data.note,
      ),
    );
  }

  @ApiResponse({
    type: WrapperResponseWalletWithdrawalRequestDto,
  })
  @Get("withdrawal-request/:id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findWalletWithdrawalRequestById(
    @Param("id") id: string,
  ): Promise<WalletWithDrawalRequest> {
    return this.queryBus.execute(new FindWithdrawalRequestByIdQuery(id));
  }

  @ApiResponse({
    type: WrapperResponseWalletWithdrawalRequestBatchDto,
  })
  @Get("my-withdrawal-request")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findWalletWithdrawalRequestsByOwner(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
    params._where = addConditionsToWhereClause(
      [
        {
          _field: "owner",
          _op: "eq",
          _val: userId,
        },
      ],
      params._where,
    );

    return this.queryBus.execute(
      new FindWalletWithdrawalRequestsByOwnerQuery(params),
    );
  }

  @ApiResponse({
    type: WrapperResponseWalletWithdrawalRequestBatchDto,
  })
  @Get("admin/user-withdrawal-requests")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findUserWalletWithdrawalRequests(
    @Query() params: SearchItemsParamsDto,
  ): Promise<WrapperResponse<WalletWithDrawalRequest[]>> {
    return this.queryBus.execute(
      new FindWalletWithdrawalRequestsByOwnerQuery(params),
    );
  }

  @Delete("withdrawal-request/:id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteWalletWithdrawalRequest(@Param("id") id: string): Promise<void> {
    return this.commandBus.execute(
      new DeleteWalletWithdrawalRequestCommand(id),
    );
  }
}
