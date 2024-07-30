import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { Notification, INotificationRepository } from "@/core/domain/notifications";
import { NotificationEntity } from '@/infrastructure/features/notifications';
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";


@Injectable()
export class NotificationRepository implements INotificationRepository{
  private readonly repository: BaseRepository<NotificationEntity>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, NotificationEntity);
  }


  async create(payload: Partial<Notification>): Promise<Notification> {
    return await this.repository.create(payload);
  }

  async find(query?: SearchItemsParams): Promise<Notification[]> {
    return await this.repository.find(query);
  }

  async findOne(id: string, fields?: string[]): Promise<Notification>{
    return await this.repository.findOne(id, fields);
  }

  async updateOne(id: string, payload: Partial<Notification>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
