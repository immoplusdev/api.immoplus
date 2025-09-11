import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty } from "class-validator";
import { UserApp } from "@/core/domain/roles";

export class LoginCommand {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.invalid_password_format_exception" })
  password: string;

  @ApiProperty({ type: String, enum: UserApp })
  @IsNotEmpty()
  source: UserApp;

  constructor(data?: OmitMethods<LoginCommand>) {
    if (data) Object.assign(this, data);
  }
}
