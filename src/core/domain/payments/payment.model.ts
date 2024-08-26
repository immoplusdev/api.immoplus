import { OmitMethods } from "@/lib/ts-utilities";
import { PaymentType } from "@/core/domain/payments/payment-type.enum";
import { PaymentCollection } from "@/core/domain/payments/payment-collection.enum";
import { PaymentStatus } from "@/core/domain/payments/payment-status.enum";
import { PaymentMethod } from "@/core/domain/payments/payment-method.enum";
import { PaymentNextAction } from "@/core/domain/payments/payment-next-action.model";
import { User } from "@/core/domain/users";
export class Payment {
  id: string;
  amount: number;
  amountNoFees: number;
  customer?: User | string;
  customerId: string;
  paymentType: PaymentType;
  collection: PaymentCollection;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  itemId: string;


  // Hub2 Fields
  hub2PaymentId?: string;
  hub2Exception?: string;
  hub2NextAction?: PaymentNextAction;
  hub2Token?: string;
  hub2Metadata?: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<Payment>) {
    if (data) Object.assign(this, data);
  }
}
