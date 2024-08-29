import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDateDto } from "@/core/application/shared/dto";
import { ServiceDates } from "@/core/domain/shared/models";
import { IsOptional } from "class-validator";

export class ProgrammerDemandeVisiteCommand {
  @IsOptional()
  id: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;
  constructor(data?: OmitMethods<ProgrammerDemandeVisiteCommand>) {
    if (data) Object.assign(this, data);
  }
}
