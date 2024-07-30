import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Role, IRoleRepository } from "@/core/domain/roles";
import { RoleEntity } from "@/infrastructure/features/roles";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";


@Injectable()
export class RoleRepository implements IRoleRepository {
  private readonly repository: BaseRepository<Role>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, RoleEntity);
  }


  async create(payload: Partial<Role>): Promise<Role> {
    return await this.repository.create(payload);
  }

  async find(query?: SearchItemsParams): Promise<Role[]> {
    return await this.repository.find(query);
  }

  async findOne(id: string, fields?: []): Promise<Role> {
    return await this.repository.findOne(id, fields);
  }

  async updateOne(id: string, payload: Partial<Role>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
