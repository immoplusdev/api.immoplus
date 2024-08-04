import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { StatusReservation } from "@/core/domain/reservations";
import { StatusFacture } from "@/core/domain/payments";
import { ServiceDateDto } from "@/infrastructure/shared/dto/service-date.dto";

export class ReservationDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  residence: string;
  @ApiProperty({ enum: StatusReservation})
  statusReservation: StatusReservation;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDateDto[];
  @ApiProperty({ enum: StatusFacture })
  statusFacture: StatusFacture;
  @ApiProperty()
  retraitProEffectue: boolean;
  @ApiProperty()
  montantTotalReservation: number;
  @ApiProperty()
  montantReservationSansCommission: number;
  @ApiProperty()
  notes: string;
  @ApiProperty()
  customerPhoneNumber: string;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  // @ApiProperty()
  // deletedAt?: Date;
  @ApiProperty()
  createdBy?: string;
  // @ApiProperty()
  // updatedBy?: string;
  // @ApiProperty()
  // deletedBy?: string;
  constructor(data?: OmitMethods<ReservationDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseReservationDto extends WrapperResponseDto<ReservationDto> {
  @ApiProperty({ type: ReservationDto })
  data: ReservationDto;
}

export class WrapperResponseReservationListDto extends WrapperResponseDto<ReservationDto[]> {
  @ApiProperty({ type: [ReservationDto] })
  data: ReservationDto[];
}

