import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty } from "class-validator";

export class CreateCommuneDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  ville: string;

  constructor(data?: OmitMethods<CreateCommuneDto>) {
    Object.assign(this, data);
  }
}
