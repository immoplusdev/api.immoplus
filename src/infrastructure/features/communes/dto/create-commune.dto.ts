import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty } from "class-validator";

export class CreateCommuneDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  villeId: string;

  constructor(data?: OmitMethods<CreateCommuneDto>) {
    Object.assign(this, data);
  }
}