import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { BienImmobilierDto } from "@/core/application/biens-immobiliers";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { StatusDemandeVisite, TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ServiceDateDto } from "@/core/application/common/dto";
import { ServiceDates } from "@/core/domain/common/models";
import { StatusFacture } from "@/core/domain/payments";
import { PublicUserInfoDto } from "@/core/application/users";
import { PublicUserInfo } from "@/core/domain/users";

export class DemandeVisiteDetailsDto {

  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ enum: StatusDemandeVisite, enumName: "StatusDemandeVisite" })
  statusDemandeVisite: StatusDemandeVisite;

  @ApiProperty({ enum: TypeDemandeVisite, enumName: "TypeDemandeVisite" })
  typeDemandeVisite: TypeDemandeVisite;

  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;

  @ApiProperty({ enum: StatusFacture, enumName: "StatusFacture" })
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

  @ApiProperty({ type: () => BienImmobilierDto })
  bienImmobilier: BienImmobilier;

  @ApiProperty({ type: () => PublicUserInfoDto })
  client: PublicUserInfo;
  @ApiProperty({ type: () => PublicUserInfoDto })
  proprietaire: PublicUserInfo;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty()
  createdBy?: string;

  constructor(data?: OmitMethods<DemandeVisiteDetailsDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseDemandeVisiteDetailsDto extends WrapperResponseDto<DemandeVisiteDetailsDto> {
  @ApiProperty({ type: DemandeVisiteDetailsDto })
  data: DemandeVisiteDetailsDto;
}



