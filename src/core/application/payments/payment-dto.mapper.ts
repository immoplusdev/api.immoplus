import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { PaymentDto } from "./payment.dto";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class PaymentDtoMapper implements IMapper<Payment, PaymentDto> {
  mapFrom(param: OmitMethods<Payment>): PaymentDto {
    return new PaymentDto({
      ...param,
      customer: getIdFromObject(param.customer),
    });
  }

  mapTo(param: OmitMethods<PaymentDto>): Payment {
    return new Payment(param);
  }
}
