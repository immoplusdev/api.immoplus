import { OmitMethods } from "@/lib/ts-utilities";

export class AmentityDto {
  constructor(data?: OmitMethods<AmentityDto>) {
    if (data) Object.assign(this, data);
  }
}
