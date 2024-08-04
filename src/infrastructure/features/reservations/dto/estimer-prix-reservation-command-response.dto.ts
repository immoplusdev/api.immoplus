import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class EstimerPrixReservationCommandResponseDto {
  constructor(data?: OmitMethods<EstimerPrixReservationCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixReservationCommandResponseDto extends WrapperResponseDto<EstimerPrixReservationCommandResponseDto> {
   @ApiProperty({ type: EstimerPrixReservationCommandResponseDto })
   data: EstimerPrixReservationCommandResponseDto;
}

