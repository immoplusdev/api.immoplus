import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Role, IRoleRepository } from "@/core/domain/roles";
import { RoleEntity } from "@/infrastructure/features/roles";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";
import { FindItemOptions, WrapperResponse } from "@/core/domain/shared/models";


@Injectable()
export class RoleRepository implements IRoleRepository {
  private readonly repository: BaseRepository<Role>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, RoleEntity);
  }


  async createMany(payload: Partial<Role>[]): Promise<Role[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Role>): Promise<Role> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Role[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Role> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Role> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Role>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Role>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
