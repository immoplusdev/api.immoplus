import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty } from "class-validator";

export class UpdateCommuneDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  ville: string;

  constructor(data?: OmitMethods<UpdateCommuneDto>) {
    Object.assign(this, data);
  }
}