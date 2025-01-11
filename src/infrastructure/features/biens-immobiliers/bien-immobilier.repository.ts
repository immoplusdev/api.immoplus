import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { BienImmobilier, IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { BienImmobilierEntity, BienImmobilierEntityMapper } from "@/infrastructure/features/biens-immobiliers";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/shared/models";

@Injectable()
export class BienImmobilierRepository implements IBienImmobilierRepository {
  private readonly repository: BaseRepository<BienImmobilier>;
  private readonly relations: RepositoryRelations = ["miniature", "video", "ville", "commune", "proprietaire"];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "miniature",
    "nom",
    "typeBienImmobilier",
    "description",
    "typeLocation",
    "aLouer",
    "amentities",
    "tags",
    "images",
    "video",
    "ville",
    "commune",
    "adresse",
    "position",
    "statusValidation",
    "prix",
    "metadata",
    "featured",
    "nombreMaxOccupants",
    "animauxAutorises",
    "bienImmobilierDisponible",
    "fetesAutorises",
    "reglesSupplementaires",
    "proprietaire",
  ];


  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, BienImmobilierEntity, this.relations)
      .setEntityMapper(new BienImmobilierEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  async createMany(payload: Partial<BienImmobilier>[]): Promise<BienImmobilier[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<BienImmobilier>): Promise<BienImmobilier> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<BienImmobilier[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<BienImmobilier> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<BienImmobilier> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<BienImmobilier>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<BienImmobilier>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
