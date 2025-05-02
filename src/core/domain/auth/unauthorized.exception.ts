import { BaseException } from "@/core/domain/common/exceptions";

export class UnauthorizedException extends BaseException {
  constructor() {
    super("$t:all.exception.unauthorized", 401);
  }
}
