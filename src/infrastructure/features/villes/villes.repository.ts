import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { Ville, IVilleRepository } from "@/core/domain/villes";
import { VilleEntity } from '@/infrastructure/features/villes';
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";

@Injectable()
export class VilleRepository implements IVilleRepository{
  private readonly repository: BaseRepository<Ville>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, VilleEntity);
  }

  async createMany(payload: Partial<Ville>[]): Promise<Ville[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Ville>): Promise<Ville> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Ville[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: string[]): Promise<Ville> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Ville>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Ville>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
