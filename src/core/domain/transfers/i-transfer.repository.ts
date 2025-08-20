import { IBaseRepository } from "../common/repositories";
import { Transfer } from "./transfer.model";

export interface ITransferRepository
  extends IBaseRepository<Transfer, Partial<Transfer>, Partial<Transfer>> {}
