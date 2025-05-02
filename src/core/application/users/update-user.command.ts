import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";
import { IsOptional } from "class-validator";

export class UpdateUserCommand {
  // basic fields
  @ApiProperty()
  @IsOptional()
  firstName?: string;
  @ApiProperty()
  @IsOptional()
  lastName?: string;
  @ApiProperty()
  @IsOptional()
  language?: string;
  @ApiProperty()
  avatar?:  string;

  // User Data
  @ApiProperty()
  @IsOptional()
  country?: string;
  @ApiProperty()
  @IsOptional()
  state?: string;
  @ApiProperty()
  @IsOptional()
  city?: string;
  @ApiProperty()
  @IsOptional()
  commune?: string;
  @ApiProperty()
  @IsOptional()
  address?: string;
  @ApiProperty()
  @IsOptional()
  address2?: string;
  @ApiProperty()
  @IsOptional()
  currency?: string;
  constructor(data?: OmitMethods<UpdateUserCommand>) {
    if(data) Object.assign(this, data);
  }
}