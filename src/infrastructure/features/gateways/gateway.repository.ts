import { Deps } from "@/core/domain/common/ioc";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";
import { Inject } from "@nestjs/common";
import { Hub2PaymentGatewayService } from "./hub2-payment-gateway.service";
import { TransfertPayloadDto } from "@/core/domain/gateways/transfers/transfert-payload.dto";
import { Hu2TransferResponseDto } from "@/core/domain/gateways/transfers/hu2-transfer-response.dto";
import { GetTransfersQueryDto } from "@/core/domain/gateways/transfers/get-transfers-query.dto";
import { TransferStatusResponseDto } from "@/core/domain/gateways/transfers/transfer-status-response.dto";

export class GatewayRepository implements IGatewayRepository {
  constructor(
    @Inject(Deps.GatewayService)
    private readonly gatewayService: Hub2PaymentGatewayService,
  ) {}

  createTransfer(
    payload: TransfertPayloadDto,
  ): Promise<Hu2TransferResponseDto> {
    return this.gatewayService.createTransfer(payload);
  }

  getTransfers(
    query?: GetTransfersQueryDto,
  ): Promise<Hu2TransferResponseDto[]> {
    return this.gatewayService.getTransfers(query);
  }

  getTransfer(id: string): Promise<Hu2TransferResponseDto> {
    return this.gatewayService.getTransfer(id);
  }

  getTransferBalance(id: string): Promise<Hu2TransferResponseDto> {
    return this.gatewayService.getTransferBalance(id);
  }
  getTransferStatus(id: string): Promise<TransferStatusResponseDto> {
    return this.gatewayService.getTransferStatus(id);
  }
}
