import { ApiProperty } from '@nestjs/swagger';

export class WrapperResponseDto<T> {
  @ApiProperty()
  data: T;
  constructor(partial?: Partial<T>) {
    if (partial) this.data = partial as T;
  }
}
