import { PaymentMethod } from "../common/enums";
import { User } from "../users";
import {
  TransferItemType,
  TransferStatus,
  TransferType,
} from "./transfer.enum";

export class Transfer {
  id: string;
  amount: number;
  currency: string;
  fees?: number;
  customer?: User | string;
  itemType: TransferItemType;
  itemId: string;
  transfetStatus: TransferStatus;
  transferType: TransferType;
  country: string;
  accountNumber?: string;
  bank?: Record<string, any>;
  recipientName?: string;
  transferProvider?: PaymentMethod;

  // Hub2 Fields
  hub2TransferId?: string;
  hub2Exception?: string;
  hub2Metadata?: Record<string, any>;

  createdAt: Date;
  createdBy?: User | string;
  updatedAt: Date;
  deletedAt?: Date;

  /**
   * Constructs a new Transfer object.
   *
   * If data is provided, it is shallowly merged into the new object.
   * The created and updated timestamps are set to the current time.
   *
   * @param data - Optional data to merge into the new object.
   */
  constructor(data?: Partial<Transfer>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
