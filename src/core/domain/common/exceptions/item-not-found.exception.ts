import { BaseException } from "./base.exception";

export class ItemNotFoundException extends BaseException {
  constructor() {
    super("$t:all.exception.item_not_found", 404);
  }
}
