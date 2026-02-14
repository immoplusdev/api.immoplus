import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import {
  StatusDemandeVisite,
  TypeDemandeVisite,
} from "@/core/domain/demandes-visites";
import { ServiceDates } from "@/core/domain/common/models";
import { StatusFacture } from "@/core/domain/payments";
import { BienImmobilierDto } from "@/core/application/biens-immobiliers";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { ServiceDateDto } from "@/core/application/common/dto";
import { PublicUserInfoDto } from "@/core/application/users";
import { PublicUserInfo } from "@/core/domain/users";

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
  deletedAt?: Date;

  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ type: () => PublicUserInfoDto })
  createdByModel?: PublicUserInfo;

  constructor(data?: OmitMethods<DemandeVisiteDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseDemandeVisiteDto extends WrapperResponseDto<DemandeVisiteDto> {
  @ApiProperty({ type: DemandeVisiteDto })
  data: DemandeVisiteDto;
}

export class WrapperResponseDemandeVisiteBatchDto extends WrapperResponseDto<
  DemandeVisiteDto[]
> {
  @ApiProperty({ type: [DemandeVisiteDto] })
  data: DemandeVisiteDto[];
}
