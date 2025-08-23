import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";

export class CreatePaymentDto {
  constructor(data?: OmitMethods<CreatePaymentDto>) {
    if (data) Object.assign(this, data);
  }
}
