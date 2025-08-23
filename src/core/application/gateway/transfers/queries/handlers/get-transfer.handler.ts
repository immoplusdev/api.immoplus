import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransferQuery } from "../get-transfer.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";

@QueryHandler(GetTransferQuery)
export class GetTransferHandler implements IQueryHandler<GetTransferQuery> {
  constructor(
    @Inject(Deps.GatewayRepository)
    private readonly gatewayRepository: IGatewayRepository,
  ) {}

  execute(query: GetTransferQuery): Promise<any> {
    return this.gatewayRepository.getTransfer(query.id);
  }
}
