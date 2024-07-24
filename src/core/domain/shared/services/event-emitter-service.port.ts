import { AppEventGroups } from "../enums/app-event-groups.enum";

export interface EventEmitterServicePort {
  emit<T>(
    eventName: string,
    payload1?: Record<string, unknown>,
    payload2?: Record<string, unknown>,
    eventGroup?: AppEventGroups
  ): Promise<T>;
}
