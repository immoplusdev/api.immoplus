import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { DemandeVisite, IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity, DemandeVisiteEntityMapper } from '@/infrastructure/features/demandes-visites';
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/shared/models";

@Injectable()
export class DemandeVisiteRepository implements IDemandeVisiteRepository{
  private readonly repository: BaseRepository<DemandeVisite>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, DemandeVisiteEntity).setEntityMapper(new DemandeVisiteEntityMapper());
  }

  async createMany(payload: Partial<DemandeVisite>[]): Promise<DemandeVisite[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<DemandeVisite>): Promise<DemandeVisite> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<DemandeVisite[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<DemandeVisite> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<DemandeVisite> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<DemandeVisite>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<DemandeVisite>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
