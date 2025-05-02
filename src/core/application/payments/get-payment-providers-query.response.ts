import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PaymentProviderDto } from "./payment-provider.dto";

export class GetPaymentProviderQueryResponse extends Array<PaymentProviderDto> {
  constructor(...items: PaymentProviderDto[]) {
    super(...items);
  }
}


export class WrapperResponseGetPaymentProviderQueryResponseDto extends WrapperResponseDto<GetPaymentProviderQueryResponse> {
  @ApiProperty({ type: PaymentProviderDto, isArray: true })
  data: GetPaymentProviderQueryResponse;

  constructor(data?: OmitMethods<GetPaymentProviderQueryResponse>) {
    if (data) super(data as never);
  }
}

export class WrapperResponseGetPaymentProviderQueryResponseDtoMapper implements IMapper<GetPaymentProviderQueryResponse, WrapperResponseGetPaymentProviderQueryResponseDto> {
  mapFrom(param: GetPaymentProviderQueryResponse): WrapperResponseGetPaymentProviderQueryResponseDto {
    return new WrapperResponseGetPaymentProviderQueryResponseDto(param);
  }

  mapTo(param: WrapperResponseGetPaymentProviderQueryResponseDto): GetPaymentProviderQueryResponse {
    return param.data;
  }
}
      