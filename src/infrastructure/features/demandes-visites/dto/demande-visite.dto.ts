import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { StatusDemandeVisite } from "@/core/domain/demandes-visites";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments";

export class DemandeVisiteDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;

  statusDemandeVisite: StatusDemandeVisite;

  datesDemandeVisite: ServiceDates;

  statusFacture: StatusFacture;

  retraitProEffectue: boolean;

  montantTotalDemandeVisite: number;

  montantDemandeVisiteSansCommission: number;

  notes: string;

  clientPhoneNumber: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: string;

  constructor(data?: OmitMethods<DemandeVisiteDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseDemandeVisiteDto extends WrapperResponseDto<DemandeVisiteDto> {
  @ApiProperty({ type: DemandeVisiteDto })
  data: DemandeVisiteDto;
}

export class WrapperResponseDemandeVisiteListDto extends WrapperResponseDto<DemandeVisiteDto[]> {
  @ApiProperty({ type: [DemandeVisiteDto] })
  data: DemandeVisiteDto[];
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  hasPrevious: boolean;
  @ApiProperty()
  hasNext: boolean;
}

