import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginCommand {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsNotEmpty({ message: '$t:all.exception.invalid_password_format_exception' })
  password: string;
  constructor(data?: OmitMethods<LoginCommand>) {
    if(data) Object.assign(this, data);
  }
}