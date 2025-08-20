import { Deps } from "@/core/domain/common/ioc";
import { Module, Provider } from "@nestjs/common";
import { Hub2PaymentGatewayService } from "./hub2-payment-gateway.service";
import { GatewayController } from "./gateway.controller";
import { TypeormModule } from "@/infrastructure/typeorm";
import { WalletsService } from "../wallets/wallet.service";
import { GatewayRepository } from "./gateway.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigsModule } from "../configs";
import { LoggingModule } from "../logging";
import { ReservationModule } from "../reservations";
import { DemandeVisiteModule } from "../demandes-visites";
import { NotificationModule } from "../notifications";
import { GlobalizationModule } from "../globalization";
import { CreateTransferHandler } from "@/core/application/gateway/transfers/commands/handlers/create-transfer.handler";
import { CreateTransferCommand } from "@/core/application/gateway/transfers/commands/create-transfer.command";
import { WalletsRepository } from "../wallets/wallet-repository";
import { PaymentRepository } from "../payments/payment.repository";
import { UserRepository } from "../users";
import { PermissionModule } from "../permissions";
import { RoleModule } from "../roles";
import { TransfersModule } from "../transfers/transfers.module";
import { GetTransfersQuery } from "@/core/application/gateway/transfers/queries/get-transfers.query";
import { GetTransfersHandler } from "@/core/application/gateway/transfers/queries/handlers/get-transfers.handler";
import { GetTransferQuery } from "@/core/application/gateway/transfers/queries/get-transfer.query";
import { GetTransferHandler } from "@/core/application/gateway/transfers/queries/handlers/get-transfer.handler";
import { GetTransferBalanceHandler } from "@/core/application/gateway/transfers/queries/handlers/get-transfer-balance.handler";
import { GetTransferBalanceQuery } from "@/core/application/gateway/transfers/queries/get-transfer-balance.query";
import { GetTransferStatusQuery } from "@/core/application/gateway/transfers/queries/get-transfer-status.query";
import { GetTransferStatusHandler } from "@/core/application/gateway/transfers/queries/handlers/get-transfer-status.handler";

const providers: Provider[] = [
  {
    provide: Deps.GatewayService,
    useClass: Hub2PaymentGatewayService,
  },
  {
    provide: Deps.WalletsService,
    useClass: WalletsService,
  },
  {
    provide: Deps.GatewayRepository,
    useClass: GatewayRepository,
  },
  {
    provide: Deps.WalletRepository,
    useClass: WalletsRepository,
  },
  {
    provide: Deps.PaymentRepository,
    useClass: PaymentRepository,
  },
  {
    provide: Deps.UsersRepository,
    useClass: UserRepository,
  },
  CreateTransferHandler,
  CreateTransferCommand,
  GetTransfersQuery,
  GetTransfersHandler,
  GetTransferQuery,
  GetTransferHandler,
  GetTransferBalanceQuery,
  GetTransferBalanceHandler,
  GetTransferStatusQuery,
  GetTransferStatusHandler,
];

@Module({
  controllers: [GatewayController],
  imports: [
    TypeormModule,
    TransfersModule,
    PermissionModule,
    RoleModule,
    CqrsModule,
    ConfigsModule,
    LoggingModule,
    ReservationModule,
    DemandeVisiteModule,
    NotificationModule,
    GlobalizationModule,
  ],
  providers: [...providers],
  exports: [...providers],
})
export class GatewayModule {}
