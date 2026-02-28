import { Transfer } from "@/core/domain/transfers/transfer.model";
import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { TransferDto } from "./transfer.dto";

export class TransferDtoMapper implements IMapper<Transfer, TransferDto> {
  mapFrom(param: OmitMethods<Transfer>): TransferDto {
    return new TransferDto({
      ...param,
    });
  }

  mapTo(param: Partial<TransferDto>): Transfer {
    return new Transfer(param);
  }
}
