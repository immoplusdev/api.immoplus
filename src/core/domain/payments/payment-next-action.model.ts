import { OmitMethods } from "@/lib/ts-utilities";

export class PaymentNextAction {
  type: string;
  message: string;
  data: Record<string, any>;

  constructor(data?: OmitMethods<PaymentNextAction>) {
    if (data) Object.assign(this, data);
  }
}
