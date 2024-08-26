import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { PaymentEntity } from "./payment.entity";


export class PaymentEntityMapper implements IMapper<PaymentEntity, Payment> {
  mapFrom(param: OmitMethods<PaymentEntity>): Payment {
    const object = new Payment({ ...param, customerId: null });
    if (typeof param.customer == "object") object.customerId = param.customer.id;
    return object;
  }

  mapTo(param: OmitMethods<Payment>): PaymentEntity {
    return new PaymentEntity(param);
  }
}
