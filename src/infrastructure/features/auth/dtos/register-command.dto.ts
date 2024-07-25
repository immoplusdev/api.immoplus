import { ApiProperty } from '@nestjs/swagger';
import { OmitMethods } from '@/lib/ts-utilities';
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsOptional()
  city?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  constructor(data?: OmitMethods<RegisterCommandDto>) {
    Object.assign(this, data);
  }
}