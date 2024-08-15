import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ServiceDate {
  @ApiProperty()
  @IsDate()
  date: Date;
  constructor(data?: ServiceDate) {
    if (data) Object.assign(this, data);
  }
}
