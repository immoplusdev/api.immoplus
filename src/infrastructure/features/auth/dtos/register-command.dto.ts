import { ApiProperty } from '@nestjs/swagger';
import { OmitMethods } from '@/lib/ts-utilities';
import { IsNotEmpty } from 'class-validator';

export class RegisterCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  city: string;
  @ApiProperty()
  @IsNotEmpty()
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