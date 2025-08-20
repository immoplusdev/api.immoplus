import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { UserData, IUserDataRepository } from "@/core/domain/users";
import { UserDataEntity } from "@/infrastructure/features/users";
import { BaseRepository } from "@/infrastructure/typeorm";
import { File } from "@/core/domain/files";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";
import { UserDataEntityMapper } from "./user-data-entity.mapper";

@Injectable()
export class UserDataRepository implements IUserDataRepository {
  private readonly repository: BaseRepository<File>;
  private readonly relations: [
    "photoIdentite",
    "pieceIdentite",
    "registreCommerce",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      UserDataEntity,
      this.relations,
    ).setEntityMapper(new UserDataEntityMapper());
  }

  async createMany(payload: Partial<UserData>[]): Promise<UserData[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<UserData>): Promise<UserData> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<UserData[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<UserData> {
    return await this.repository.findOneByQuery(query, options);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<UserData> {
    return await this.repository.findOne(id, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<UserData>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<UserData>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    await this.repository.deleteOne(id);
    return id;
  }
}
