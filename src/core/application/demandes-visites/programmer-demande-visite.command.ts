import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { ServiceDateDto } from "@/core/application/common/dto";
import { ServiceDates } from "@/core/domain/common/models";
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
