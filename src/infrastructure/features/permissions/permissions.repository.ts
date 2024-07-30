import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Permission, IPermissionRepository } from "@/core/domain/permissions";
import { PermissionEntity } from "@/infrastructure/features/permissions";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";


@Injectable()
export class PermissionRepository implements IPermissionRepository {
  private readonly repository: BaseRepository<Permission>;
  private readonly permissionRepository: Repository<PermissionEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, PermissionEntity);
    this.permissionRepository = dataSource.getRepository(PermissionEntity);
  }


  async create(payload: Partial<Permission>): Promise<Permission> {
    return await this.repository.create(payload);
  }

  async find(query?: SearchItemsParams): Promise<Permission[]> {
    return await this.repository.find(query);
  }


  async findOne(id: string, fields?: []): Promise<Permission> {
    return await this.repository.findOne(id, fields);
  }

  async updateOne(id: string, payload: Partial<Permission>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: {
        role: roleId,
      },
    });
  }
}
