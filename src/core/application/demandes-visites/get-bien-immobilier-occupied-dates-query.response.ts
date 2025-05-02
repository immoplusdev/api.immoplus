import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";
import { WrapperResponseDto } from "@/lib/responses";
import { ServiceDateDto } from "@/core/application/common/dto";
import { ServiceDates } from "@/core/domain/common/models";

export class GetBienImmobilierOccupiedDatesQueryResponse {
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  dates: ServiceDates;
  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseGetBienImmobilierOccupiedDatesQueryResponseDto extends WrapperResponseDto<GetBienImmobilierOccupiedDatesQueryResponse> {
  @ApiProperty({ type: GetBienImmobilierOccupiedDatesQueryResponse })
  data: GetBienImmobilierOccupiedDatesQueryResponse;
}
