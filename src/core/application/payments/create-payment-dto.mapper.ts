import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { CreatePaymentDto } from "./create-payment.dto";

export class CreatePaymentDtoMapper
  implements IMapper<CreatePaymentDto, Payment>
{
  mapFrom(param: OmitMethods<CreatePaymentDto>): Payment {
    return new Payment(param as never);
  }

  mapTo(param: Partial<Payment>): CreatePaymentDto {
    return new CreatePaymentDto(param as never);
  }
}
