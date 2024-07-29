import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsValidPassword } from "@/lib/ts-utilities/class-validator/is-valid-password.validator";
import { IsNotEmpty } from "class-validator";

export class UpdatePasswordCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;
  @ApiProperty()
  @IsValidPassword()
  newPassword: string;
  constructor(data?: OmitMethods<UpdatePasswordCommandDto>) {
    Object.assign(this, data);
  }
}
