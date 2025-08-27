import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UploadFileFromUrlCommand {
  @ApiProperty()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsOptional()
  folder?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  constructor(data?: OmitMethods<UploadFileFromUrlCommand>) {
    if (data) Object.assign(this, data);
  }
}
