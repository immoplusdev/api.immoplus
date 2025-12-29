import { DataSource, In } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  Notification,
  INotificationRepository,
  INotificationService,
  SendNotificationParams,
} from "@/core/domain/notifications";
import { NotificationEntity } from "@/infrastructure/features/notifications";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";

@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly repository: BaseRepository<NotificationEntity>;

  // private readonly notificationRepository: Repository<NotificationEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.NotificationService)
    readonly notificationService: INotificationService,
  ) {
    this.repository = new BaseRepository(dataSource, NotificationEntity);
    // this.notificationRepository = dataSource.getRepository(NotificationEntity);
  }

  async createMany(payload: Partial<Notification>[]): Promise<Notification[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Notification>): Promise<Notification> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Notification[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Notification> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Notification> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Notification>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Notification>): Promise<string> {
    return this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }

  async sendTestNotification(params: SendNotificationParams): Promise<string> {
    await this.notificationService.sendNotification({
      userId: params.userId,
      sendMail: true,
      sendSms: true,
      skipInAppNotification: false,
      subject: params.subject,
      message: params.message,
      htmlMessage: params.htmlMessage || params.message,
      returnUrl: params.returnUrl || "localhost:3000/estate_detail/12",
      data: params.data,
    });

    return Promise.resolve("Notification sent successfully");
  }
}
