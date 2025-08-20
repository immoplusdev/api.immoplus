import { OmitMethods } from "@/lib/ts-utilities";

export class TransferDto {
  constructor(data?: OmitMethods<TransferDto>) {
    if (data) Object.assign(this, data);
  }
}
