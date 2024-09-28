import { BaseException } from "@/core/domain/shared/exceptions";

export class AccessForbiddenException extends BaseException {
  constructor() {
    super(`$t:all.exception.access_forbidden`, 403);
  }
}