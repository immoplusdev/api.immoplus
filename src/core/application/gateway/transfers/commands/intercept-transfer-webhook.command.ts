import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { Hu2TransferResponseDto } from "@/core/domain/gateways/transfers/hu2-transfer-response.dto";
import Api from "twilio/lib/rest/Api";

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
  test: Boolean;
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: string;
  

  constructor(data?: OmitMethods<InterceptTransferWebhookCommand>) {
    if (data) Object.assign(this, data);
  }
}
