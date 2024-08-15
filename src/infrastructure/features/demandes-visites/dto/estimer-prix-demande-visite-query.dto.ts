import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/dto";
import { ApiProperty } from "@nestjs/swagger";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";

export class EstimerPrixDemandeVisiteQueryDto {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ enum: TypeDemandeVisite })
  typeDemandeVisite: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryDto>) {
    if (data) Object.assign(this, data);
  }
}
