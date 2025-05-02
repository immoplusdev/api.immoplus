import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";

export class GetDemandeVisiteByIdQuery {
  @ApiProperty({ format: "uuid" })
  id: string;
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQuery>) {
    if(data) Object.assign(this, data);
  }
}
