import { IUsersRepository, User } from '@/core/domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@/infrastructure/features/users/users.entity';
import { Deps } from '@/core/domain/shared/ioc';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async create(payload: Partial<User>): Promise<User> {
    return await this.repository.save(payload);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, payload: Partial<User>): Promise<string> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.repository.findOneBy({ phoneNumber });
  }
}
