import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { Residence } from "@/core/domain/residences";
import { PublicUserInfo } from "@/core/domain/users";
import { ResidenceDto } from "@/infrastructure/features/residences";
import { StatusReservation } from "@/core/domain/reservations";
import { ServiceDateDto } from "@/core/application/shared/dto";
import { StatusFacture } from "@/core/domain/payments";
import { PublicUserInfoDto } from "@/core/application/features/users";
import { da } from "@faker-js/faker";

export class GetReservationByIdQueryResponse {
  @ApiProperty({ format: "uuid" })
  id: string;
  // @ApiProperty({ type: "string", format: "uuid" })
  // residence: Residence | string;
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

  @ApiProperty({ type: () => ResidenceDto })
  residence: Residence;
  @ApiProperty({ type: () => PublicUserInfoDto })
  client: PublicUserInfo;
  @ApiProperty({ type: () => PublicUserInfoDto })
  proprietaire: PublicUserInfo;

  constructor(data?: Partial<GetReservationByIdQueryResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseGetReservationByIdQueryResponseDto extends WrapperResponseDto<GetReservationByIdQueryResponse> {
  @ApiProperty({ type: GetReservationByIdQueryResponse })
  data: GetReservationByIdQueryResponse;
}