import { GetTransfersQueryDto } from "@/core/domain/gateways/transfers/get-transfers-query.dto";

export class GetTransfersQuery {
    constructor(public readonly data: GetTransfersQueryDto) {}
}