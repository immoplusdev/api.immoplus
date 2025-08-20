import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransfersQuery } from "../get-transfers.query";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { Hu2TransferResponseDto } from "@/core/domain/gateways/transfers/hu2-transfer-response.dto";

@QueryHandler(GetTransfersQuery)
export class GetTransfersHandler implements IQueryHandler<GetTransfersQuery> {
  constructor(
    @Inject(Deps.GatewayRepository)
    private readonly gatewayRepository: IGatewayRepository,
  ) {}

  execute(query: GetTransfersQuery): Promise<Hu2TransferResponseDto[]> {
    return this.gatewayRepository.getTransfers(query.data);
  }
}
