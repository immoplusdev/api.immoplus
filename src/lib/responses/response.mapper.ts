import { IMapper } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses/wrapper-response.dto";
import { WrapperResponse } from "@/core/domain/shared/models";

export class WrapperResponseDtoMapper<T>
  implements IMapper<T, WrapperResponseDto<T>> {
  mapFrom(param: T): WrapperResponseDto<T> {
    return new WrapperResponseDto(param);
  }

  mapFromQueryResult(param: WrapperResponse<T>): WrapperResponseDto<T> {
    return new WrapperResponseDto<T>().buildFromQueryResult(param);
  }

  mapTo(param: WrapperResponseDto<T>): T {
    return param.data;
  }

  mapToQueryResult(param: WrapperResponseDto<T>): WrapperResponse<T> {
    return new WrapperResponse<T>().buildFromOuterResponse(param);
  }
}
