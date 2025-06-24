import { BaseException } from "@/core/domain/common/exceptions";

export class NotEnoughtMoneyException extends BaseException {
  constructor() {
    super(`$t:all.exception.not_enought_money`, 400);
  }
}