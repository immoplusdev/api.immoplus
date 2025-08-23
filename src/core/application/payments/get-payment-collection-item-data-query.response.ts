import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PaymentCollectionItemData } from "@/core/domain/payments";

export class GetPaymentCollectionItemDataQueryResponse extends OmitType(
  PaymentCollectionItemData,
  [] as const,
) {
  constructor(data?: OmitMethods<GetPaymentCollectionItemDataQueryResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseGetPaymentCollectionItemDataQueryResponseDto extends WrapperResponseDto<GetPaymentCollectionItemDataQueryResponse> {
  @ApiProperty({ type: GetPaymentCollectionItemDataQueryResponse })
  data: GetPaymentCollectionItemDataQueryResponse;

  constructor(data?: OmitMethods<GetPaymentCollectionItemDataQueryResponse>) {
    if (data) super(data as never);
  }
}

export class WrapperResponseGetPaymentCollectionItemDataQueryResponseDtoMapper
  implements
    IMapper<
      GetPaymentCollectionItemDataQueryResponse,
      WrapperResponseGetPaymentCollectionItemDataQueryResponseDto
    >
{
  mapFrom(
    param: GetPaymentCollectionItemDataQueryResponse,
  ): WrapperResponseGetPaymentCollectionItemDataQueryResponseDto {
    return new WrapperResponseGetPaymentCollectionItemDataQueryResponseDto(
      param,
    );
  }

  mapTo(
    param: WrapperResponseGetPaymentCollectionItemDataQueryResponseDto,
  ): GetPaymentCollectionItemDataQueryResponse {
    return param.data;
  }
}
