import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransferStatusQuery } from "../get-transfer-status.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";
import { TransferStatusResponseDto } from "@/core/domain/gateways/transfers/transfer-status-response.dto";

@QueryHandler(GetTransferStatusQuery)
export class GetTransferStatusHandler implements IQueryHandler<GetTransferStatusQuery> {
    constructor(@Inject(Deps.GatewayRepository) private readonly gatewayRepository: IGatewayRepository) {}

    execute(query: GetTransferStatusQuery): Promise<TransferStatusResponseDto> {
        return this.gatewayRepository.getTransferStatus(query.id);
    }
}