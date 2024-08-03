import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, TableForeignKey,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "@/core/domain/roles";
import { UserEntity } from "@/infrastructure/features/users";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

@Entity("roles")
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "name", type: "varchar" })
  name: string;
  @Column({ name: "description", type: "varchar", nullable: true })
  description?: string;
  @Column({ name: "icon", type: "varchar", nullable: true })
  icon?: string;
  @Column({ name: "enforce_tfa", type: "bool", default: false })
  enforceTfa: boolean;
  @Column({ name: "app_access", type: "bool", default: false })
  appAccess: boolean;
  @Column({ name: "admin_access", type: "bool", default: false })
  adminAccess: boolean;



  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  // @DeleteDateColumn({ name: "deleted_at" })
  // deletedAt?: Date;
  //
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @Column({ name: "created_by" })
  // createdBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "updated_by" })
  // updatedBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "deleted_by" })
  // deletedBy?: string;
  hasAdminAccess() {
    return this.adminAccess || this.id == UserRole.Admin;
  }
}
