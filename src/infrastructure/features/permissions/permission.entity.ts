import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleEntity } from "@/infrastructure/features/roles";
import { Role } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { UserEntity } from "@/infrastructure/features/users";

@Entity("permissions")
export class PermissionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role | string;
  @Column({ name: "collection_name", type: "varchar", nullable: true })
  collectionName: PermissionCollection;
  @Column({ name: "action", type: "varchar", nullable: true })
  action: PermissionAction;
  @Column({ name: "fields", type: "json", nullable: true })
  fields?: string[];

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "updated_by" })
  // updatedBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "deleted_by" })
  // deletedBy?: string;
}
