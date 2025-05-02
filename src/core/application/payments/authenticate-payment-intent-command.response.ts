import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PaymentDto } from "@/core/application/payments";

export class AuthenticatePaymentIntentCommandResponse extends OmitType(PaymentDto, [] as const) {
  constructor(data?: OmitMethods<AuthenticatePaymentIntentCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseAuthenticatePaymentIntentCommandResponseDto extends WrapperResponseDto<AuthenticatePaymentIntentCommandResponse> {
  @ApiProperty({ type: AuthenticatePaymentIntentCommandResponse })
  data: AuthenticatePaymentIntentCommandResponse;

  constructor(data?: OmitMethods<AuthenticatePaymentIntentCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseAuthenticatePaymentIntentCommandResponseDtoMapper implements IMapper<AuthenticatePaymentIntentCommandResponse, WrapperResponseAuthenticatePaymentIntentCommandResponseDto> {
  mapFrom(param: AuthenticatePaymentIntentCommandResponse): WrapperResponseAuthenticatePaymentIntentCommandResponseDto {
    return new WrapperResponseAuthenticatePaymentIntentCommandResponseDto(param);
  }

  mapTo(param: WrapperResponseAuthenticatePaymentIntentCommandResponseDto): AuthenticatePaymentIntentCommandResponse {
    return param.data;
  }
}
      