import { IUsersRepository, User, UserWithRoleAndPermissions } from "@/core/domain/users";
import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "@/infrastructure/features/users/users.entity";
import { Deps } from "@/core/domain/shared/ioc";
import { IPermissionRepository } from "@/core/domain/permissions";
import { Role } from "@/core/domain/roles";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";
import { mapQueryFieldsToTypeormSelection } from "@/infrastructure/http";

@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly userRepository: Repository<UserEntity>;
  private readonly repository: BaseRepository<User>;
  private readonly relations = ["role", "additionalData"];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.PermissionRepository)
    private readonly permissionRepository: IPermissionRepository,
  ) {
    this.repository = new BaseRepository(dataSource, UserEntity);
    this.userRepository = dataSource.getRepository(UserEntity);
  }

  async createMany(payload: Partial<User>[]): Promise<User[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<User>): Promise<User> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<User[]> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: string[]): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: this.relations,
      select: mapQueryFieldsToTypeormSelection(fields),
    });
  }

  async findOneByEmail(email: string, fields?: string[]): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: this.relations,
      select: mapQueryFieldsToTypeormSelection(fields),
    });
  }

  async findOneByPhoneNumber(phoneNumber: string, fields?: string[]): Promise<User | null> {
    return await this.userRepository.findOne(
      {
        where: { phoneNumber },
        relations: this.relations,
        select: mapQueryFieldsToTypeormSelection(fields),
      },
    );
  }

  async findOneByUsername(username: string, fields?: string[]): Promise<User | null> {
    let user: User | null = null;
    try {
      if (username.includes("@")) user = await this.findOneByEmail(username, fields);
      if (!user) user = await this.findOneByPhoneNumber(username, fields);
    } catch (error) {
      return null;
    }
    return user;
  }

  async findOneByIdWithRoleAndPermissions(id: string, fields?: string[]): Promise<UserWithRoleAndPermissions | null> {

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: this.relations,
      select: mapQueryFieldsToTypeormSelection(fields),
    });

    const permissions = await this.permissionRepository.findByRoleId((user.role as Role).id);

    return new UserWithRoleAndPermissions({
      ...user,
      permissions,
    });
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<User>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<User>): Promise<string> {
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
