import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class GetPaymentProviderQuery {
  constructor(data?: OmitMethods<GetPaymentProviderQuery>) {
    if(data) Object.assign(this, data);
  }
}
