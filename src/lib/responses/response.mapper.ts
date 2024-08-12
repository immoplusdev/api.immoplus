import { IMapper } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses/wrapper-response.dto";
import { WrapperResponse } from "@/core/domain/shared/models";

export class WrapperResponseDtoMapper<T>
  implements IMapper<T, WrapperResponseDto<T>> {

  entityMapper: IMapper<any, any> = null;

  constructor(entityMapper?: IMapper<any, any>) {
    if (entityMapper) this.entityMapper = entityMapper;
  }

  mapFrom(param: T): WrapperResponseDto<T> {
    if (this.entityMapper) {
      if (Array.isArray(param)) {
        param = param.map((item) => this.entityMapper.mapFrom(item)) as never;
      } else {
        param = this.entityMapper.mapFrom(param);
      }
    }
    return new WrapperResponseDto(param);
  }

  mapFromQueryResult(param: WrapperResponse<T>): WrapperResponseDto<T> {
    if (this.entityMapper) {
      if (Array.isArray(param.data)) {
        param.data = param.data.map((item) => this.entityMapper.mapFrom(item)) as never;
      } else {
        param.data = this.entityMapper.mapFrom(param.data);
      }
    }
    return new WrapperResponseDto<T>().buildFromQueryResult(param);
  }

  mapTo(param: WrapperResponseDto<T>): T {
    if (this.entityMapper) {
      if (Array.isArray(param)) {
        param = param.map((item) => this.entityMapper.mapTo(item)) as never;
      } else {
        param = this.entityMapper.mapTo(param);
      }
    }
    return param.data;
  }

  mapToQueryResult(param: WrapperResponseDto<T>): WrapperResponse<T> {
    if (this.entityMapper) {
      if (Array.isArray(param.data)) {
        param.data = param.data.map((item) => this.entityMapper.mapTo(item)) as never;
      } else {
        param.data = this.entityMapper.mapTo(param.data);
      }
    }
    return new WrapperResponse<T>().buildFromOuterResponse(param);
  }


}
