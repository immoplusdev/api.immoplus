import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";

export class GetPaymentProviderQuery {
  constructor(data?: OmitMethods<GetPaymentProviderQuery>) {
    if (data) Object.assign(this, data);
  }
}
