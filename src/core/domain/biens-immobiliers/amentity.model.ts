import { OmitMethods } from "@/lib/ts-utilities";

export class Amentity {
  constructor(data?: OmitMethods<Amentity>) {
    if (data) Object.assign(this, data);
  }
}
