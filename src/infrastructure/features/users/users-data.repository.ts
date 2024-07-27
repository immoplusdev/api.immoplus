import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { UserData, IUsersDataRepository } from "@/core/domain/users";
import { UserDataEntity } from '@/infrastructure/features/users';
import { BaseRepository } from "@/infrastructure/typeorm";
import { File } from "@/core/domain/files";
import { SearchItemsParams } from "@/core/domain/http";


@Injectable()
export class UsersDataRepository implements IUsersDataRepository{
  private readonly repository: BaseRepository<File>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, UserDataEntity);
  }


  async create(payload: Partial<UserData>): Promise<UserData> {
    return await this.repository.create(payload);
  }

  async find(query?: SearchItemsParams): Promise<UserData[]> {
    return await this.repository.find(query);
  }

  async findOne(id: string, fields?: []): Promise<UserData> {
    return await this.repository.findOne(id, fields);
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
