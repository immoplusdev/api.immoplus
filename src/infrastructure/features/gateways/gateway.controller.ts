import { UserRole } from "@/core/domain/roles";
import { ReqHeaders, RequiredRoles } from "@/infrastructure/decorators";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth";
import { Deps } from "@/core/domain/common/ioc";
import { WalletsService } from "../wallets/wallet.service";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { CreateTransferCommand } from "@/core/application/gateway/transfers/commands/create-transfer.command";
import { GetTransfersQueryDto } from "@/core/domain/gateways/transfers/get-transfers-query.dto";
import { GetTransfersQuery } from "@/core/application/gateway/transfers/queries/get-transfers.query";
import { GetTransferQuery } from "@/core/application/gateway/transfers/queries/get-transfer.query";
import { GetTransferBalanceQuery } from "@/core/application/gateway/transfers/queries/get-transfer-balance.query";
import { GetTransferStatusQuery } from "@/core/application/gateway/transfers/queries/get-transfer-status.query";
import { Hub2PaymentGatewayService } from "./hub2-payment-gateway.service";
import { InterceptTransferWebhookCommand } from "@/core/application/gateway/transfers/commands/intercept-transfer-webhook.command";

@ApiTags("Gateway")
@Controller("gateway")
export class GatewayController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(Deps.WalletsService) private readonly walletService: WalletsService,
  ) {}

  @Post("/hu2/transfer")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async makeTransfer(@Body() data: CreateTransferDto) {
    return this.commandBus.execute(
      new CreateTransferCommand(
        data.walletWithDrawalRequestId,
        data.description,
      ),
    );
  }

  @Get("/hu2/transfers")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransfers(@Query() param: GetTransfersQueryDto) {
    return this.queryBus.execute(new GetTransfersQuery(param));
  }

  @Get("/hu2/transfers/:id/balance")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransferBalance(@Param("id") id: string) {
    return this.queryBus.execute(new GetTransferBalanceQuery(id));
  }

  @Get("/hu2/transfers/:id/status")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransferStatus(@Param("id") id: string) {
    return this.queryBus.execute(new GetTransferStatusQuery(id));
  }

  @Get("/hu2/transfers/:id")
  @RequiredRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransfer(@Param("id") id: string) {
    return this.queryBus.execute(new GetTransferQuery(id));
  }

  @Post("/hu2/webhook/transfer")
  @ApiNoContentResponse()
  @HttpCode(204)
  public async transferWebhook(
    @Body() payload: Record<string, any>,
    @ReqHeaders() headers: Record<string, string>,
  ): Promise<void> {
    const json = JSON.stringify(payload);
    const webHookSignature =
      Hub2PaymentGatewayService.getWebhookSignatureFromHeaders(headers);

    const command = new InterceptTransferWebhookCommand({
      owner: payload?.owner,
      type: payload?.type,
      signature: webHookSignature,
      json,
      data: payload?.data,
      test: payload?.test as boolean,
      id: payload?.id,
      createdAt: payload?.createdAt,
    });

    await this.commandBus.execute(command);
  }
}
