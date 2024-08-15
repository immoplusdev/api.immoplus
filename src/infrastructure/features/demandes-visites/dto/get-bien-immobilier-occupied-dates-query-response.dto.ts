import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ServiceDateDto } from "@/infrastructure/shared/dto";
import { ServiceDates } from "@/core/domain/shared/models";

export class GetBienImmobilierOccupiedDatesQueryResponseDto {
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  dates: ServiceDates;
  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQueryResponseDto>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseGetBienImmobilierOccupiedDatesQueryResponseDto extends WrapperResponseDto<GetBienImmobilierOccupiedDatesQueryResponseDto> {
   @ApiProperty({ type: GetBienImmobilierOccupiedDatesQueryResponseDto })
   data: GetBienImmobilierOccupiedDatesQueryResponseDto;
}