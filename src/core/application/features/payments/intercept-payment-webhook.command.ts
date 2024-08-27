import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentNextAction, PaymentStatus } from "@/core/domain/payments";

export class InterceptPaymentWebhookCommand {
  @ApiProperty()
  type: string;
  @ApiProperty()
  signature: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  token: string;
  @ApiProperty()
  status: PaymentStatus;
  @ApiProperty()
  nextAction: PaymentNextAction;
  @ApiProperty()
  payments: Record<string, any>[];
  @ApiProperty()
  json: string;

  constructor(data?: OmitMethods<InterceptPaymentWebhookCommand>) {
    if (data) Object.assign(this, data);
  }
}
