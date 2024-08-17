import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class GetResidenceOccupiedDatesQueryResponse {
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  dates: ServiceDates;

  constructor(data?: OmitMethods<GetResidenceOccupiedDatesQueryResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseGetResidenceOccupiedDatesQueryResponseDto<T> extends WrapperResponseDto<GetResidenceOccupiedDatesQueryResponse> {
  @ApiProperty({ type: GetResidenceOccupiedDatesQueryResponse })
  data: GetResidenceOccupiedDatesQueryResponse;
}