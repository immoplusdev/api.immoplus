import { ApiProperty } from "@/core/domain/common/docs";

export class PaymentProviderDto {
  @ApiProperty({ format: "uuid" })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  method: string;
  @ApiProperty()
  currency: string;

  constructor(data?: PaymentProviderDto) {
    Object.assign(this, data);
  }
}
