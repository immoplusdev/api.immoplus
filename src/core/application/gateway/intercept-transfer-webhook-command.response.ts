import { IMapper, OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class InterceptTransferWebhookCommandResponse {
  constructor(data?: OmitMethods<InterceptTransferWebhookCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseInterceptTransferWebhookCommandResponseDto extends WrapperResponseDto<InterceptTransferWebhookCommandResponse> {
  @ApiProperty({ type: InterceptTransferWebhookCommandResponse })
  data: InterceptTransferWebhookCommandResponse;
  constructor(data?: OmitMethods<InterceptTransferWebhookCommandResponse>) {
    if (data) super(data);
  }
}
      
  export class WrapperResponseInterceptTransferWebhookCommandResponseDtoMapper implements IMapper<InterceptTransferWebhookCommandResponse, WrapperResponseInterceptTransferWebhookCommandResponseDto> {
      mapFrom(param: InterceptTransferWebhookCommandResponse): WrapperResponseInterceptTransferWebhookCommandResponseDto {
         return new WrapperResponseInterceptTransferWebhookCommandResponseDto(param);
      }

      mapTo(param: WrapperResponseInterceptTransferWebhookCommandResponseDto): InterceptTransferWebhookCommandResponse {
         return param.data;
      }
  }
      