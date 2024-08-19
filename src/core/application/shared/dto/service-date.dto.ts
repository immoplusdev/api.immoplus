import { OmitMethods } from "@/lib/ts-utilities";
import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ServiceDateDto {
  @ApiProperty()
  @IsDate()
  date: Date;
  constructor(data?: OmitMethods<ServiceDateDto>) {
    Object.assign(this, data);
  }
}