import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { Commune, ICommuneRepository } from "@/core/domain/communes";
import { CommuneEntity } from '@/infrastructure/features/communes';
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";

@Injectable()
export class CommuneRepository implements ICommuneRepository{
  private readonly repository: BaseRepository<Commune>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, CommuneEntity);
  }

  async createMany(payload: Partial<Commune>[]): Promise<Commune[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Commune>): Promise<Commune> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<Commune[]> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: string[]): Promise<Commune> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Commune>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Commune>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
