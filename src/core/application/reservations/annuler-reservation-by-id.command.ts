import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsOptional } from "class-validator";

export class AnnulerReservationByIdCommand {
  @IsOptional()
  userId: string;
  @ApiProperty({ format: "uuid" })
  reservation: string;
  @ApiProperty()
  @IsOptional()
  notes?: string;
  constructor(data?: OmitMethods<AnnulerReservationByIdCommand>) {
    if (data) Object.assign(this, data);
  }
}
