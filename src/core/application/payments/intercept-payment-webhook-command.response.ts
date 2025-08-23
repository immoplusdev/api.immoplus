import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class InterceptPaymentWebhookCommandResponse {
  constructor(data?: OmitMethods<InterceptPaymentWebhookCommandResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseInterceptPaymentWebhookCommandResponseDto extends WrapperResponseDto<InterceptPaymentWebhookCommandResponse> {
  @ApiProperty({ type: InterceptPaymentWebhookCommandResponse })
  data: InterceptPaymentWebhookCommandResponse;
  constructor(data?: OmitMethods<InterceptPaymentWebhookCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseInterceptPaymentWebhookCommandResponseDtoMapper
  implements
    IMapper<
      InterceptPaymentWebhookCommandResponse,
      WrapperResponseInterceptPaymentWebhookCommandResponseDto
    >
{
  mapFrom(
    param: InterceptPaymentWebhookCommandResponse,
  ): WrapperResponseInterceptPaymentWebhookCommandResponseDto {
    return new WrapperResponseInterceptPaymentWebhookCommandResponseDto(param);
  }

  mapTo(
    param: WrapperResponseInterceptPaymentWebhookCommandResponseDto,
  ): InterceptPaymentWebhookCommandResponse {
    return param.data;
  }
}
