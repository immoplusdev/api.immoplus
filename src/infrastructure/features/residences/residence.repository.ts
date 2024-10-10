import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Residence, IResidenceRepository } from "@/core/domain/residences";
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/shared/models";
import { ResidenceEntityMapper } from "@/infrastructure/features/residences";

@Injectable()
export class ResidenceRepository implements IResidenceRepository {
  private readonly repository: BaseRepository<Residence>;
  private readonly relations: RepositoryRelations = ["miniature", "video", "ville", "commune", "proprietaire"];
  private readonly fullTextSearchFields: string[] = [
    "nom",
    "adresse",
    "description",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, ResidenceEntity, this.relations)
      .setEntityMapper(new ResidenceEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }


  async createMany(payload: Partial<Residence>[]): Promise<Residence[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Residence>): Promise<Residence> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Residence[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Residence> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Residence> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Residence>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Residence>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
