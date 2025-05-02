import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";

export class HistoriqueRetrait {
  @ApiProperty()
  montantNonRetire: number;
  @ApiProperty()
  montantRetire: number;
  @ApiProperty()
  montantTotal: number;
  constructor(data?: OmitMethods<HistoriqueRetrait>) {
    if (data) Object.assign(this, data);
  }
}
