import { ApiProperty } from "@nestjs/swagger";
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

