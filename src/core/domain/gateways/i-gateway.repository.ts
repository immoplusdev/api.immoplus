import { GetTransfersQueryDto } from "./transfers/get-transfers-query.dto";
import { Hu2TransferResponseDto } from "./transfers/hu2-transfer-response.dto";
import { TransferStatusResponseDto } from "./transfers/transfer-status-response.dto";
import { TransfertPayloadDto } from "./transfers/transfert-payload.dto";

export interface IGatewayRepository {
    createTransfer(payload: TransfertPayloadDto): Promise<Hu2TransferResponseDto>;
    getTransfers(query?: GetTransfersQueryDto ): Promise<Hu2TransferResponseDto[]>;
    getTransfer(id: string): Promise<Hu2TransferResponseDto>;
    getTransferBalance(id: string): Promise<Hu2TransferResponseDto>;
    getTransferStatus(id: string): Promise<TransferStatusResponseDto>;
}