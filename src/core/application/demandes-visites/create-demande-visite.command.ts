import { OmitMethods } from "@/lib/ts-utilities";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ApiProperty } from "@/core/domain/common/docs";
import { ServiceDateDto } from "@/core/application/common/dto";
import { IsOptional } from "class-validator";

export class CreateDemandeVisiteCommand {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ enum: TypeDemandeVisite })
  typeDemandeVisite: TypeDemandeVisite;
  // @ApiProperty({ type: ServiceDateDto, isArray: true })
  // @IsOptional()
  // datesDemandeVisite: ServiceDates;
  @ApiProperty()
  clientPhoneNumber: string;
  @IsOptional()
  @ApiProperty()
  notes: string;
  @IsOptional()
  userId: string;

  setClientPhoneNumber(phoneNumber: string) {
    this.clientPhoneNumber = phoneNumber;
  }

  constructor(data?: OmitMethods<CreateDemandeVisiteCommand>) {
    if (data) Object.assign(this, data);
  }
}
