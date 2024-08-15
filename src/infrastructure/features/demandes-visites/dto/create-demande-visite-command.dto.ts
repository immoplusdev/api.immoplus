import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class CreateDemandeVisiteCommandDto {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ enum: TypeDemandeVisite })
  typeDemandeVisite: TypeDemandeVisite;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;
  @ApiProperty()
  clientPhoneNumber: string;
  @ApiProperty()
  notes: string;

  constructor(data?: OmitMethods<CreateDemandeVisiteCommandDto>) {
    if (data) Object.assign(this, data);
  }
}
