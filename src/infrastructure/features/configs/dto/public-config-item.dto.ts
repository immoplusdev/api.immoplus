import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";

export class PublicConfigItemDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  value: string;
  constructor(data?: OmitMethods<PublicConfigItemDto>) {
    Object.assign(this, data);
  }
}

