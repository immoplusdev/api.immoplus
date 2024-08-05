import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationCommandResponseDto {
  constructor(data?: OmitMethods<CreateReservationCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseCreateReservationCommandResponseDto extends WrapperResponseDto<CreateReservationCommandResponseDto> {
   @ApiProperty({ type: CreateReservationCommandResponseDto })
   data: CreateReservationCommandResponseDto;
}

