import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ServiceDateDto } from "@/core/application/shared/dto";
import { ServiceDates } from "@/core/domain/shared/models";

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