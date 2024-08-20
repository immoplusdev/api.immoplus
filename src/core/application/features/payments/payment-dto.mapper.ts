import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { PaymentDto } from "./payment.dto";


export class PaymentDtoMapper implements IMapper<Payment, PaymentDto> {
  mapFrom(param: OmitMethods<Payment>): PaymentDto {
    const object = new PaymentDto({ ...param, customerId: null });
    if (typeof param.customer === "object") object.customerId = param.customer.id;
    return object;
  }

  mapTo(param: OmitMethods<PaymentDto>): Payment {
    return new Payment(param);
  }
}
