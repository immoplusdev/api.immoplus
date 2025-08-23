import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { StatusReservation } from "@/core/domain/reservations";
import { StatusFacture } from "@/core/domain/payments";
import { Residence } from "@/core/domain/residences";
import { ServiceDateDto } from "@/core/application/common/dto";
import { ResidenceDto } from "@/infrastructure/features/residences";
import { IsNotEmpty } from "class-validator";

export class ReservationDto {
  @ApiProperty({ format: "uuid" })
  id: string;
  @ApiProperty({ type: () => ResidenceDto })
  residence: Residence | string;
  @ApiProperty({ enum: StatusReservation, enumName: "StatusReservation" })
  statusReservation: StatusReservation;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDateDto[];
  @ApiProperty({ type: Date, nullable: true })
  dateDebut: Date;
  @ApiProperty({ type: Date, nullable: true })
  dateFin: Date;
  @ApiProperty({ enum: StatusFacture })
  statusFacture: StatusFacture;
  @ApiProperty()
  retraitProEffectue: boolean;
  @ApiProperty()
  montantTotalReservation: number;
  @ApiProperty()
  montantCommission: number;
  @ApiProperty()
  notes: string;
  @ApiProperty()
  clientPhoneNumber: string;
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

export class WrapperResponseReservationListDto extends WrapperResponseDto<
  ReservationDto[]
> {
  @ApiProperty({ type: [ReservationDto] })
  data: ReservationDto[];
}
