import { IsDate } from "class-validator";

export class ServiceDate {
  @IsDate()
  date: Date;
  constructor(data?: ServiceDate) {
    if (data) Object.assign(this, data);
  }
}
