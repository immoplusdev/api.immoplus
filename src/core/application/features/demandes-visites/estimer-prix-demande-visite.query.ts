import { OmitMethods } from "@/lib/ts-utilities";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ApiProperty } from "@nestjs/swagger";

export class EstimerPrixDemandeVisiteQuery {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ enum: TypeDemandeVisite })
  typeDemandeVisite: TypeDemandeVisite;
  // @ApiProperty({ type: ServiceDateDto, isArray: true })
  // datesDemandeVisite: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQuery>) {
    if (data) Object.assign(this, data);
  }
}
