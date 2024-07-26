import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Permission, IPermissionRepository } from "@/core/domain/permissions";
import { PermissionEntity } from "@/infrastructure/features/permissions";


@Injectable()
export class PermissionRepository implements IPermissionRepository {
  private readonly repository: Repository<PermissionEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(PermissionEntity);
  }


  async create(payload: Partial<Permission>): Promise<Permission> {
    return await this.repository.save(payload);
  }

  async find(): Promise<Permission[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Permission> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, payload: Partial<Permission>): Promise<string> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    return await this.repository.find({
      where: {
        role: roleId,
      },
    });
  }
}
