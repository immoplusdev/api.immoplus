import {
  IUserRepository,
  PublicUserInfo,
  User,
  UserWithRoleAndPermissions,
} from "@/core/domain/users";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserEntity, UserEntityMapper } from "@/infrastructure/features/users";
import { Deps } from "@/core/domain/common/ioc";
import { IPermissionRepository } from "@/core/domain/permissions";
import { Role, UserRole } from "@/core/domain/roles";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";
import { RoleRepository } from "../roles/role.repository";

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repository: BaseRepository<User>;
  private readonly relations = [
    "role",
    "additionalData",
    "additionalData.photoIdentite",
    "additionalData.pieceIdentite",
    "additionalData.registreCommerce",
    "avatar",
  ];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "address",
    "address2",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "deletedAt",
    "deletedBy",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.PermissionRepository)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(Deps.RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {
    this.repository = new BaseRepository(dataSource, UserEntity, this.relations)
      .setEntityMapper(new UserEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields)
      .setLoadRelationIds(false);
  }

  // Create
  async createMany(payload: Partial<User>[]): Promise<User[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<User>): Promise<User> {
    // console.log("payload : ",payload);
    // const role =  await this.roleRepository.findOne("a9ff35cc-41da-11f0-8a97-6e5a18eac3d4");
    // payload.role = role as Role;
    // console.log("payload.role : ",payload.role);
    // payload.createdBy = null;

    return await this.repository.createOne(payload);
  }

  // Read
  async findByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<WrapperResponse<User[]>> {
    return await this.repository.findByQuery(query, options);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<User> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<User> {
    return this.repository.findOneByQuery(query, options);
  }

  async findPublicUserInfoByUserId(id: string): Promise<PublicUserInfo | null> {
    const result = await this.findOne(id, {
      fields: ["id", "email", "firstName", "lastName", "phoneNumber"],
      relations: [],
    });
    return {
      id,
      ...result,
    };
  }

  async findClientByPhoneNumber(
    phoneNumber: string,
  ): Promise<PublicUserInfo | null> {
    const result = await this.findOneByQuery({
      _where: [
        {
          _field: "phoneNumber",
          _val: sanitizePhoneNumber(phoneNumber),
        },
      ],
    });

    return {
      ...{ id: result?.id },
      ...{ email: result?.email },
      ...{ firstName: result?.firstName },
      ...{ lastName: result?.lastName },
      ...{ phoneNumber: result?.phoneNumber },
    };
  }

  async findOneByEmail(
    email: string,
    options?: FindItemOptions,
  ): Promise<User | null> {
    return await this.findOneByQuery(
      { _where: [{ _field: "email", _val: email }] },
      options,
    );
  }

  async findOneByPhoneNumber(
    phoneNumber: string,
    options?: FindItemOptions,
  ): Promise<User | null> {
    return await this.findOneByQuery(
      {
        _where: [
          {
            _field: "phoneNumber",
            _val: sanitizePhoneNumber(phoneNumber),
          },
        ],
      },
      options,
    );
  }

  async findOneByUsername(
    username: string,
    options?: FindItemOptions,
  ): Promise<User | null> {
    let user: User | null = null;
    try {
      if (username.includes("@")) {
        user = await this.findOneByEmail(username, options);
      }

      if (!user) user = await this.findOneByPhoneNumber(username, options);
    } catch (error) {
      return null;
    }
    return user;
  }

  async findOneByIdWithRoleAndPermissions(
    id: string,
    options?: FindItemOptions,
  ): Promise<UserWithRoleAndPermissions | null> {
    const user = await this.findOne(id, options);
    if (!user) throw new UnauthorizedException();

    const permissions = await this.permissionRepository.findByRoleId(
      (user.role as Role).id,
    );

    return new UserWithRoleAndPermissions({
      ...user,
      permissions: permissions.data,
    });
  }

  // Update
  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<User>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<User>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  // Delete
  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    await this.repository.deleteOne(id);
    return id;
  }

  async findAdminUsers(): Promise<User[]> {
    const { data } = await this.repository.findByQuery({
      _where: [
        {
          _field: "role",
          _val: UserRole.Admin,
        },
      ],
    });
    return data;
  }
}
