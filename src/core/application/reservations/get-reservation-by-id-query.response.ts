import { ApiProperty, OmitType } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ReservationDetailsDto } from "./reservation-details.dto";

export class GetReservationByIdQueryResponse extends OmitType(ReservationDetailsDto, [] as const) {
  constructor(data?: Partial<GetReservationByIdQueryResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseGetReservationByIdQueryResponseDto extends WrapperResponseDto<GetReservationByIdQueryResponse> {
  @ApiProperty({ type: GetReservationByIdQueryResponse })
  data: GetReservationByIdQueryResponse;
}