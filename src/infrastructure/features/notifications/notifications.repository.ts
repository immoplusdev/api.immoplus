import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Notification, INotificationRepository } from "@/core/domain/notifications";
import { NotificationEntity } from "@/infrastructure/features/notifications";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";


@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly repository: BaseRepository<NotificationEntity>;

  // private readonly notificationRepository: Repository<NotificationEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
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

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Notification[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: string[]): Promise<Notification> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Notification>): Promise<string[]> {
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
}
