import { IsValidPassword, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdatePasswordCommand {
  @IsOptional()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;
  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.empty_password_exception"})
    // @IsValidPassword()
  newPassword: string;
  constructor(data?: OmitMethods<UpdatePasswordCommand>) {
    if(data) Object.assign(this, data);
  }
}
