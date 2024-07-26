import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "@/infrastructure/features/roles";
import { Role } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: "role", type: "uuid" })
  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role | string;
  @Column({ name: "collection_name", type: "varchar", nullable: true })
  collectionName: PermissionCollection;
  @Column({ name: "action", type: "varchar", nullable: true })
  action: PermissionAction;
  @Column({ name: "fields", type: "json", nullable: true })
  fields?: string[];
}
