import { AutoMapper, IMapper } from "@/lib/ts-utilities";
import { Notification } from "@/core/domain/notifications";
import { NotificationDto } from "./notifications.dto";


export class NotificationDtoMapper {
  private mapper: AutoMapper;
  constructor() {
    this.mapper = new AutoMapper();
  }

  mapFrom(object: Notification): NotificationDto {
    return this.mapper.execute<Notification, NotificationDto>(object);
  }

  mapTo(object: NotificationDto): Notification {
    return this.mapper.execute<NotificationDto, Notification>(object);
  }
}
