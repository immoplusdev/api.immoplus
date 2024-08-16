import { IsValidPassword, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdatePasswordCommand {
  @IsOptional()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;
  @ApiProperty()
  @IsValidPassword()
  newPassword: string;
  constructor(data?: OmitMethods<UpdatePasswordCommand>) {
    if(data) Object.assign(this, data);
  }
}