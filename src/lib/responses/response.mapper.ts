import { IMapper } from '@/lib/ts-utilities';
import { WrapperResponseDto } from '@/lib/responses/wrapper-response.dto';

export class WrapperResponseDtoMapper<T>
  implements IMapper<T, WrapperResponseDto<T>>
{
  mapFrom(param: T): WrapperResponseDto<T> {
    return new WrapperResponseDto(param);
  }
  mapTo(param: WrapperResponseDto<T>): T {
    return param.data;
  }
}
