import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty } from "class-validator";

export class UpdateVilleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  constructor(data?: OmitMethods<UpdateVilleDto>) {
    Object.assign(this, data);
  }
}