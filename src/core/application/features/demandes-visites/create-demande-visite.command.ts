import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDateDto } from "@/core/application/shared/dto";
import { IsOptional } from "class-validator";

export class CreateDemandeVisiteCommand {
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
  @IsOptional()
  userId: string;

  setClientPhoneNumber(phoneNumber: string) {
    this.clientPhoneNumber = phoneNumber;
  }

  constructor(data?: OmitMethods<CreateDemandeVisiteCommand>) {
    if (data) Object.assign(this, data);
  }
}