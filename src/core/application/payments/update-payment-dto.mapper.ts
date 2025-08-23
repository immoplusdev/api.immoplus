import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { Payment } from "@/core/domain/payments";
import { UpdatePaymentDto } from "./update-payment.dto";

export class UpdatePaymentDtoMapper
  implements IMapper<UpdatePaymentDto, Payment>
{
  mapFrom(param: OmitMethods<UpdatePaymentDto>): Payment {
    return new Payment(param as never);
  }

  mapTo(param: Partial<Payment>): UpdatePaymentDto {
    return new UpdatePaymentDto(param as never);
  }
}
