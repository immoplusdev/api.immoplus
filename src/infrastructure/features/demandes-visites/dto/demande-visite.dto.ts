import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { StatusDemandeVisite, TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments";
import { BienImmobilierDto } from "@/core/application/features/biens-immobiliers";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { ServiceDateDto } from "@/core/application/shared/dto";

export class DemandeVisiteDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ type: () => BienImmobilierDto })
  bienImmobilier: BienImmobilier;

  @ApiProperty({ enum: StatusDemandeVisite, enumName: "StatusDemandeVisite" })
  statusDemandeVisite: StatusDemandeVisite;

  @ApiProperty({ enum: TypeDemandeVisite, enumName: "TypeDemandeVisite" })
  typeDemandeVisite: TypeDemandeVisite;

  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;

  @ApiProperty({ enum: StatusFacture })
  statusFacture: StatusFacture;

  @ApiProperty()
  retraitProEffectue: boolean;

  @ApiProperty()
  montantTotalDemandeVisite: number;

  @ApiProperty()
  montantDemandeVisiteSansCommission: number;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  clientPhoneNumber: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty()
  createdBy?: string;

  constructor(data?: OmitMethods<DemandeVisiteDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseDemandeVisiteDto extends WrapperResponseDto<DemandeVisiteDto> {
  @ApiProperty({ type: DemandeVisiteDto })
  data: DemandeVisiteDto;
}

export class WrapperResponseDemandeVisiteBatchDto extends WrapperResponseDto<DemandeVisiteDto[]> {
  @ApiProperty({ type: [DemandeVisiteDto] })
  data: DemandeVisiteDto[];
}

