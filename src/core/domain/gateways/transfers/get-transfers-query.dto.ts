import { ApiProperty } from "@nestjs/swagger";
import Api from "twilio/lib/rest/Api";

export class GetTransfersQueryDto {
  @ApiProperty({ type: String, required: false })
  reference?: string;
  @ApiProperty({ type: Date, required: false })
  to?: Date;
  @ApiProperty({ type: Date, required: false })
  from?: Date;
  @ApiProperty({ type: String, required: false })
  page?: number;
  @ApiProperty({ type: Number, required: false })
  perPage?: number;
}
