import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsOptional } from "class-validator";

export class UpdateConfigDto {
  @ApiProperty()
  @IsOptional()
  websiteUrl: string;
  @ApiProperty()
  @IsOptional()
  normalVisitPrice: number;
  @ApiProperty()
  @IsOptional()
  expressVisitPrice: number;
  @ApiProperty()
  @IsOptional()
  projectName: string;
  @ApiProperty()
  @IsOptional()
  projectUrl: string;
  @ApiProperty()
  @IsOptional()
  projectLogo: string;
  @ApiProperty()
  @IsOptional()
  smsSenderName: string;
  @ApiProperty()
  @IsOptional()
  proximityRadius: number;
  @ApiProperty()
  @IsOptional()
  standardShippingPrice: number;
  @ApiProperty()
  @IsOptional()
  flashShippingPrice: number;
  @ApiProperty()
  @IsOptional()
  contactEmail: string;
  @ApiProperty()
  @IsOptional()
  contactPhoneNumber: string;
  constructor(data?: OmitMethods<UpdateConfigDto>) {
    Object.assign(this, data);
  }
}