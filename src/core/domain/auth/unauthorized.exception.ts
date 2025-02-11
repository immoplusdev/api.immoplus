import { BaseException } from "@/core/domain/shared/exceptions";

export class UnauthorizedException extends BaseException {
  constructor() {
    super("$t:all.exception.unauthorized", 401);
  }
}