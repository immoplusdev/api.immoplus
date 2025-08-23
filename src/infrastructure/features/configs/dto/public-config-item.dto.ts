import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";

export class PublicConfigItemDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  value: string;
  constructor(data?: OmitMethods<PublicConfigItemDto>) {
    Object.assign(this, data);
  }
}
