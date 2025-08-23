import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";

export class PieceDto {
  @ApiProperty()
  nom: string;
  @ApiProperty()
  nombre: number;

  constructor(data?: OmitMethods<PieceDto>) {
    Object.assign(this, data);
  }
}
