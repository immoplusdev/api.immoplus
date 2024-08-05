import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { ReservationDto } from "@/infrastructure/features/reservations";
import { Residence } from "@/core/domain/residences";
import { PublicUserInfo } from "@/core/domain/users";
import { PublicUserInfoDto } from "@/infrastructure/features/users";
import { ResidenceDto } from "@/infrastructure/features/residences";

export class GetReservationByIdQueryResponseDto extends PartialType(ReservationDto) {
  @ApiProperty({ type: ResidenceDto })
  residence: Residence;
  @ApiProperty({ type: PublicUserInfoDto })
  client: PublicUserInfo;
  @ApiProperty({ type: PublicUserInfoDto })
  proprietaire: PublicUserInfo;
}

export class WrapperResponseGetReservationByIdQueryResponseDto extends WrapperResponseDto<GetReservationByIdQueryResponseDto> {
  @ApiProperty({ type: GetReservationByIdQueryResponseDto })
  data: GetReservationByIdQueryResponseDto;
}