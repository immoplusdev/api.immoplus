import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty } from "class-validator";

export class CreateVilleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  constructor(data?: OmitMethods<CreateVilleDto>) {
    Object.assign(this, data);
  }
}
