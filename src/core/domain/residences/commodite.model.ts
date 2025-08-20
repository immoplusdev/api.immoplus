import { OmitMethods } from "@/lib/ts-utilities";
import { commiditeList } from "./commodite-list";

export class Commodite {
  text: string;
  icon: string;

  getText() {
    this.text =
      commiditeList.find((item) => item.value === this.icon)?.text || "";
    return this;
  }

  constructor(data?: OmitMethods<Commodite>) {
    if (data) Object.assign(this, data);
  }
}
