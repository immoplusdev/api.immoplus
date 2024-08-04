import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponse } from "@/core/domain/shared/models";

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

  buildFromQueryResult(queryResult: WrapperResponse<T>) {
    Object.assign(this, queryResult);
    return this;
  }

  constructor(data?: T) {
    if (data) this.data = { ...this.data, data };
  }
}
