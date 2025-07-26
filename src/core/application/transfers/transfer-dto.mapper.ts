import { Transfer } from "@/core/domain/transfers/transfer.model";
import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { TransferDto } from "./transfer.dto";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";


export class TransferDtoMapper implements IMapper<Transfer, TransferDto> {
  mapFrom(param: OmitMethods<Transfer>): TransferDto {
    return new TransferDto({
      ...param,
      customer: getIdFromObject(param.customer),
    });
  }

  mapTo(param: OmitMethods<TransferDto>): Transfer {
    return new Transfer(param);
  }
}