import { OmitMethods } from "@/lib/ts-utilities";

export class VerifyOtpOptions {
  resetIfValid?: boolean;
  throwException?: boolean;
  constructor(data?: OmitMethods<VerifyOtpOptions>) {
    if (data) Object.assign(this, data);
  }
}
