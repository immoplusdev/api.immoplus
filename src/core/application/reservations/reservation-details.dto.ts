import { ApiProperty } from "@/core/domain/common/docs";
import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "@/infrastructure/features/residences";
import { PublicUserInfoDto } from "@/core/application/users";
import { PublicUserInfo } from "@/core/domain/users";
import { StatusReservation } from "@/core/domain/reservations";
import { ServiceDateDto } from "@/core/application/common/dto";
import { StatusFacture } from "@/core/domain/payments";

export class ReservationDetailsDto {
  @ApiProperty({ format: "uuid" })
  id: string;
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

  constructor(data?: OmitMethods<ReservationDetailsDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseReservationDetailsDto extends WrapperResponseDto<ReservationDetailsDto> {
  @ApiProperty({ type: ReservationDetailsDto })
  data: ReservationDetailsDto;
}

export class WrapperResponseReservationDetailsDtoMapper implements IMapper<ReservationDetailsDto, WrapperResponseReservationDetailsDto> {
  mapFrom(param: ReservationDetailsDto): WrapperResponseReservationDetailsDto {
    return new WrapperResponseReservationDetailsDto(param);
  }

  mapTo(param: WrapperResponseReservationDetailsDto): ReservationDetailsDto {
    return param.data;
  }
}

// export class WrapperResponseReservationDetailsListDto extends WrapperResponseDto<ReservationDetailsDto[]> {
//   @ApiProperty({ type: [ReservationDetailsDto] })
//   data: ReservationDetailsDto[];
//   @ApiProperty()
//   currentPage: number;
//   @ApiProperty()
//   totalPages: number;
//   @ApiProperty()
//   pageSize: number;
//   @ApiProperty()
//   totalCount: number;
//   @ApiProperty()
//   hasPrevious: boolean;
//   @ApiProperty()
//   hasNext: boolean;
// }

