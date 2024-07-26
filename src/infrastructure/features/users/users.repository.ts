import { IUsersRepository, User, UserWithRoleAndPermissions } from "@/core/domain/users";
import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "@/infrastructure/features/users/users.entity";
import { Deps } from "@/core/domain/shared/ioc";
import { IPermissionRepository } from "@/core/domain/permissions";
import { Role } from "@/core/domain/roles";

@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly repository: Repository<UserEntity>;
  private readonly relations = ["role", "additionalData"];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.PermissionRepository)
    private readonly permissionRepository: IPermissionRepository,
  ) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async create(payload: Partial<User>): Promise<User> {
    return await this.repository.save(payload);
  }

  async find(): Promise<User[]> {
    return await this.repository.find({
      relations: this.relations,
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      relations: this.relations,
    });
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
    return await this.repository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.repository.findOne(
      {
        where: { phoneNumber },
        relations: this.relations,
      },
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    let user: User | null = null;
    try {
      if (username.includes("@")) user = await this.findByEmail(username);
      if (!user) user = await this.findByPhoneNumber(username);
    } catch (error) {
      console.log(error);
      return null;
    }
    return user;
  }

  async findByIdWithRoleAndPermissions(id: string): Promise<UserWithRoleAndPermissions | null> {

    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: this.relations,
    });

    const permissions = await this.permissionRepository.findByRoleId((user.role as Role).id);

    return new UserWithRoleAndPermissions({
      ...user,
      permissions,
    });
  }
}
