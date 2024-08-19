import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDateDto } from "@/core/application/shared/dto";

export class EstimerPrixDemandeVisiteQuery {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ enum: TypeDemandeVisite })
  typeDemandeVisite: TypeDemandeVisite;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQuery>) {
    if (data) Object.assign(this, data);
  }
}
