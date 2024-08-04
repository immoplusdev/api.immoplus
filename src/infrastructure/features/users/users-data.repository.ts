import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { UserData, IUsersDataRepository } from "@/core/domain/users";
import { UserDataEntity } from "@/infrastructure/features/users";
import { BaseRepository } from "@/infrastructure/typeorm";
import { File } from "@/core/domain/files";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";


@Injectable()
export class UsersDataRepository implements IUsersDataRepository {
  private readonly repository: BaseRepository<File>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, UserDataEntity);
  }


  async createMany(payload: Partial<UserData>[]): Promise<UserData[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<UserData>): Promise<UserData> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<UserData[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: []): Promise<UserData> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<UserData>): Promise<string[]> {
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
