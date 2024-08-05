import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AnnulerReservationByIdCommandDto {
  @ApiProperty({ format: "uuid" })
  reservation: string;

  @ApiProperty()
  @IsOptional()
  notes?: string;

  constructor(data?: OmitMethods<AnnulerReservationByIdCommandDto>) {
    Object.assign(this, data);
  }
}
