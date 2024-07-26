import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { Role, IRoleRepository } from "@/core/domain/roles";
import { RoleEntity } from '@/infrastructure/features/roles';


@Injectable()
export class RoleRepository implements IRoleRepository{
  private readonly repository: Repository<RoleEntity>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(RoleEntity);
  }


  async create(payload: Partial<Role>): Promise<Role> {
    return await this.repository.save(payload);
  }

  async findAll(): Promise<Role[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Role> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, payload: Partial<Role>): Promise<string> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
