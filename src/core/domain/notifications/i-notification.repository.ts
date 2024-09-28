import { IBaseRepository } from '@/core/domain/shared/repositories';
import { Notification } from '@/core/domain/notifications';

export interface INotificationRepository extends IBaseRepository<Notification, Partial<Notification>, Partial<Notification>> {}
