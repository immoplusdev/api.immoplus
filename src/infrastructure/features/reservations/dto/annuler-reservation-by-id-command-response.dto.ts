import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { Residence } from "@/core/domain/residences";
import { StatusReservation } from "@/core/domain/reservations";
import { ServiceDateDto } from "@/infrastructure/shared/dto";
import { StatusFacture } from "@/core/domain/payments";

export class AnnulerReservationByIdCommandResponseDto {
  @ApiProperty({ format: "uuid" })
  id: string;
  @ApiProperty({ type: "string", format: "uuid" })
  residence: Residence | string;
  @ApiProperty({ enum: StatusReservation })
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
}

export class WrapperResponseAnnulerReservationByIdCommandResponseDto extends WrapperResponseDto<AnnulerReservationByIdCommandResponseDto> {
  @ApiProperty({ type: AnnulerReservationByIdCommandResponseDto })
  data: AnnulerReservationByIdCommandResponseDto;
}

