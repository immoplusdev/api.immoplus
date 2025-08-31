import { BaseException } from "@/core/domain/common/exceptions";

export class NotificationException extends BaseException {
  constructor(
    $message: string,
    $code: number,
    $messageCode: string,
    $messageId: string = "UNAUTHORIZED",
  ) {
    super($message, $code, $messageCode, $messageId);
  }
}
