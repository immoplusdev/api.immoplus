import { Notification } from "@/core/domain/notifications";
import { NotificationDto } from "./notification.dto";


export class NotificationDtoMapper {
  mapFrom(object: Notification): NotificationDto {
    return new NotificationDto(object);
  }

  mapTo(object: NotificationDto): Notification {
    return new Notification(object as never);
  }
}
