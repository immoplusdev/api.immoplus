import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetPasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
  constructor(data?: OmitMethods<ResetPasswordCommand>) {
    if(data) Object.assign(this, data);
  }
}