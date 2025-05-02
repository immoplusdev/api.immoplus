import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ReservationDetailsDto } from "./reservation-details.dto";

export class CreateReservationCommandResponse extends OmitType(ReservationDetailsDto, [] as const) {
  constructor(data?: Partial<CreateReservationCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseCreateReservationCommandResponseDto extends WrapperResponseDto<CreateReservationCommandResponse> {
  @ApiProperty({ type: CreateReservationCommandResponse })
  data: CreateReservationCommandResponse;
}

