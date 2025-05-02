import { ApiProperty } from "@/core/domain/common/docs";
import { WrapperResponse } from "@/core/domain/common/models";

export class WrapperResponseDto<T> {
  @ApiProperty()
  data: T;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  hasPrevious: boolean;
  @ApiProperty()
  hasNext: boolean;

  setData(data: T) {
    this.data = data;
    return this;
  }

  buildFromQueryResult(queryResult: WrapperResponse<T>) {
    Object.assign(this, queryResult);
    return this;
  }


  constructor(data?: T) {
    if (data) this.data = data;
  }
}
