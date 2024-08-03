import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { AppConfigs, IAppConfigsRepository } from "@/core/domain/configs";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { AppConfigsEntity } from "@/infrastructure/features/configs";

@Injectable()
export class AppConfigsRepository implements IAppConfigsRepository{
  private readonly repository: BaseRepository<AppConfigs>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, AppConfigsEntity);
  }

  async createMany(payload: Partial<AppConfigs>[]): Promise<AppConfigs[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<AppConfigs>): Promise<AppConfigs> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<AppConfigs[]> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: string[]): Promise<AppConfigs> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<AppConfigs>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<AppConfigs>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
