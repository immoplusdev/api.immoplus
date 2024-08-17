import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationCommandResponse {
  constructor(data?: OmitMethods<CreateReservationCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseCreateReservationCommandResponseDto extends WrapperResponseDto<CreateReservationCommandResponse> {
  @ApiProperty({ type: CreateReservationCommandResponse })
  data: CreateReservationCommandResponse;
}

