import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsOptional } from "class-validator";

export class AnnulerDemandeVisiteByIdCommand {
  @IsOptional()
  userId: string;
  @ApiProperty({ format: "uuid" })
  demandeVisite: string;
  @ApiProperty()
  @IsOptional()
  notes?: string;
  constructor(data?: OmitMethods<AnnulerDemandeVisiteByIdCommand>) {
    if (data) Object.assign(this, data);
  }
}
