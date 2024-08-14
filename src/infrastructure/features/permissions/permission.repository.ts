import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Permission, IPermissionRepository } from "@/core/domain/permissions";
import { PermissionEntity } from "@/infrastructure/features/permissions";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";
import { FindItemOptions, WrapperResponse } from "@/core/domain/shared/models";


@Injectable()
export class PermissionRepository implements IPermissionRepository {
  private readonly repository: BaseRepository<Permission>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, PermissionEntity);
  }


  async createMany(payload: Partial<Permission>[]): Promise<Permission[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Permission>): Promise<Permission> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Permission[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Permission> {
    return await this.repository.findOne(id, options);
  }


  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Permission> {
    return this.repository.findOneByQuery(query, options);
  }

  async findByRoleId(roleId: string): Promise<WrapperResponse<Permission[]>> {
    return await this.repository.findByQuery({
      _where: [
        {
          _field: "role",
          _op: "eq",
          _val: roleId,
          _l_op: "and",
        },
      ],
    });
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Permission>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Permission>): Promise<string> {
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
