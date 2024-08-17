import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { PublicUserInfoDto } from "@/core/application/features/users";
import { PublicUserInfo } from "@/core/domain/users";
import { StatusDemandeVisite, TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ServiceDateDto } from "@/infrastructure/shared/dto";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierDto } from "@/core/application/features/biens-immobiliers/bien-immobilier.dto";

export class GetDemandeVisiteByIdQueryResponse {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ enum: StatusDemandeVisite })
  statusDemandeVisite: StatusDemandeVisite;

  @ApiProperty({ enum: TypeDemandeVisite })
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

  @ApiProperty({ type: () => BienImmobilierDto })
  bienImmobilier: BienImmobilier;
  @ApiProperty({ type: () => PublicUserInfoDto })
  client: PublicUserInfo;
  @ApiProperty({ type: () => PublicUserInfoDto })
  proprietaire: PublicUserInfo;

  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseGetDemandeVisiteByIdQueryResponseDto extends WrapperResponseDto<GetDemandeVisiteByIdQueryResponse> {
  @ApiProperty({ type: GetDemandeVisiteByIdQueryResponse })
  data: GetDemandeVisiteByIdQueryResponse;
}