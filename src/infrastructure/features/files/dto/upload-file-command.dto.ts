import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsOptional } from "class-validator";

export class UploadFileCommandDto {
  @ApiProperty()
  @IsOptional()
  url?: string;
  @ApiProperty()
  @IsOptional()
  title?: string;
  @ApiProperty()
  @IsOptional()
  folder?: string;
  @ApiProperty()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsOptional()
  tags?: string;
  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;

  constructor(data?: OmitMethods<UploadFileCommandDto>) {
    Object.assign(this, data);
  }
}
