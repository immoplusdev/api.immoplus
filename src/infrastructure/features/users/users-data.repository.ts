import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { UserData, IUsersDataRepository } from "@/core/domain/users";
import { UserDataEntity } from '@/infrastructure/features/users';


@Injectable()
export class UsersDataRepository implements IUsersDataRepository{
  private readonly repository: Repository<UserDataEntity>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(UserDataEntity);
  }


  async create(payload: Partial<UserData>): Promise<UserData> {
    return await this.repository.save(payload);
  }

  async find(): Promise<UserData[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<UserData> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, payload: Partial<UserData>): Promise<string> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
