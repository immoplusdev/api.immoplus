import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";

export class UpdateDemandeVisiteDto {
  @ApiProperty()
  notes: string;
  constructor(data?: OmitMethods<UpdateDemandeVisiteDto>) {
    if (data) Object.assign(this, data);
  }
}