import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { PaymentEntity } from "./payment.entity";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";


export class PaymentEntityMapper implements IMapper<PaymentEntity, Payment> {
  mapFrom(param: OmitMethods<PaymentEntity>): Payment {
    return new Payment({
      ...param,
      hub2NextAction: param.hub2NextAction ? JSON.parse(param.hub2NextAction as never) : null,
      customer: getIdFromObject(param.customer),
    });
  }

  mapTo(param: OmitMethods<Payment>): PaymentEntity {
    return new PaymentEntity(param);
  }
}
