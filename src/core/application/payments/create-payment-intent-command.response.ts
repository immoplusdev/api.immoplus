import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PaymentDto } from "@/core/application/payments";

export class CreatePaymentIntentCommandResponse extends OmitType(
  PaymentDto,
  [] as const,
) {
  constructor(data?: OmitMethods<CreatePaymentIntentCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseCreatePaymentIntentCommandResponseDto extends WrapperResponseDto<CreatePaymentIntentCommandResponse> {
  @ApiProperty({ type: CreatePaymentIntentCommandResponse })
  data: CreatePaymentIntentCommandResponse;

  constructor(data?: OmitMethods<CreatePaymentIntentCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseCreatePaymentIntentCommandResponseDtoMapper
  implements
    IMapper<
      CreatePaymentIntentCommandResponse,
      WrapperResponseCreatePaymentIntentCommandResponseDto
    >
{
  mapFrom(
    param: CreatePaymentIntentCommandResponse,
  ): WrapperResponseCreatePaymentIntentCommandResponseDto {
    return new WrapperResponseCreatePaymentIntentCommandResponseDto(param);
  }

  mapTo(
    param: WrapperResponseCreatePaymentIntentCommandResponseDto,
  ): CreatePaymentIntentCommandResponse {
    return param.data;
  }
}
