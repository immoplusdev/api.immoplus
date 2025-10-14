import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { Hu2TransferResponseDto } from "@/core/domain/gateways/transfers/hu2-transfer-response.dto";

export class InterceptTransferWebhookCommand {
  @ApiProperty()
  owner: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  signature: string;
  @ApiProperty()
  json: string;
  @ApiProperty()
  data: Hu2TransferResponseDto;
  @ApiProperty()
  test: boolean;
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: string;

  constructor(data?: OmitMethods<InterceptTransferWebhookCommand>) {
    if (data) Object.assign(this, data);
  }
}
