import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { commiditeList } from "@/core/domain/residences";
import { IsNotEmpty } from "class-validator";

export class CommoditeDto {
  @ApiProperty()
  @IsNotEmpty()
  text: string;
  @ApiProperty()
  @IsNotEmpty()
  icon: string;

  getText() {
    this.text =
      commiditeList.find((item) => item.value === this.icon)?.text || "";
    return this;
  }

  constructor(data?: OmitMethods<CommoditeDto>) {
    if (data) Object.assign(this, data);
  }
}
