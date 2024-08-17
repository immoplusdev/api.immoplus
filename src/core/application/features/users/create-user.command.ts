import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserCommand {

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
  avatar?: File | string;

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
  
  constructor(data?: OmitMethods<CreateUserCommand>) {
    if(data) Object.assign(this, data);
  }
}