import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransferBalanceQuery } from "../get-transfer-balance.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";

@QueryHandler(GetTransferBalanceQuery)
export class GetTransferBalanceHandler
  implements IQueryHandler<GetTransferBalanceQuery>
{
  constructor(
    @Inject(Deps.GatewayRepository)
    private readonly gatewayRepository: IGatewayRepository,
  ) {}

  execute(query: GetTransferBalanceQuery): Promise<any> {
    return this.gatewayRepository.getTransferBalance(query.id);
  }
}
