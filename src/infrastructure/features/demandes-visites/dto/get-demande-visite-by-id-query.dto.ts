import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";

export class GetDemandeVisiteByIdQueryDto {
  @ApiProperty({ format: "uuid" })
  bienImmobilierId: string;

  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryDto>) {
    if (data) Object.assign(this, data);
  }
}
