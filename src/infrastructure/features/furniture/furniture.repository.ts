import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { Furniture, IFurnitureRepository } from "@/core/domain/furniture";
import { FurnitureEntity } from "./furniture.entity";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import {
  FindItemOptions,
  RepositoryRelations,
  WrapperResponse,
} from "@/core/domain/common/models";
import { FurnitureEntityMapper } from "./furniture-entity.mapper";
import { GeoJsonType } from "@/core/domain/map/geo-json-type.enum";

@Injectable()
export class FurnitureRepository implements IFurnitureRepository {
  private readonly repository: BaseRepository<Furniture>;
  private readonly relations: RepositoryRelations = [
    "owner",
    "ville",
    "commune",
    "video",
  ];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "titre",
    "description",
    "adresse",
    "status",
    "owner",
    "ville",
    "commune",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      FurnitureEntity,
      this.relations,
    )
      .setEntityMapper(new FurnitureEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  // ─── Create ───

  async createMany(
    payload: Partial<Furniture>[],
    returnPayload?: boolean,
  ): Promise<Furniture[]> {
    const data = payload.map((item) => this.enrichWithGeoCoordinates(item));
    return await this.repository.createMany(data, returnPayload);
  }

  async createOne(
    payload: Partial<Furniture>,
    returnPayload?: boolean,
  ): Promise<Furniture> {
    const data = this.enrichWithGeoCoordinates(payload);
    return await this.repository.createOne(data, returnPayload);
  }

  // ─── Read ───

  async findByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<WrapperResponse<Furniture[]>> {
    return await this.repository.findByQuery(query, options);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Furniture> {
    return await this.repository.findOne(id, options);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Furniture> {
    return await this.repository.findOneByQuery(query, options);
  }

  // ─── Update ───

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Furniture>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Furniture>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  // ─── Delete ───

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }

  // ─── Helpers privés ───

  /**
   * Si un GeoJSON Point valide est fourni, on en extrait automatiquement
   * les coordonnées lat/lng pour les stocker en colonnes séparées
   * (utilisées par les requêtes de proximité).
   */
  private enrichWithGeoCoordinates(
    payload: Partial<Furniture>,
  ): Partial<Furniture> {
    if (
      payload?.position?.coordinates?.length === 2 &&
      payload?.position?.type === GeoJsonType.Point
    ) {
      return {
        ...payload,
        lng: payload.position.coordinates[0],
        lat: payload.position.coordinates[1],
      };
    }
    return { ...payload };
  }
}
