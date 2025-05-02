import { ApiProperty, OmitType } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ReservationDetailsDto } from "@/core/application/reservations/reservation-details.dto";

export class AnnulerReservationByIdCommandResponse extends OmitType(ReservationDetailsDto, [] as const) {

}

export class WrapperResponseAnnulerReservationByIdCommandResponseDto extends WrapperResponseDto<AnnulerReservationByIdCommandResponse> {
  @ApiProperty({ type: AnnulerReservationByIdCommandResponse })
  data: AnnulerReservationByIdCommandResponse;
}