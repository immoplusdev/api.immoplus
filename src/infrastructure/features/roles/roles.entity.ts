import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from "@/core/domain/roles";

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
  @Column({ name: 'enforce_tfa', type: 'bool', default: false })
  enforceTfa: boolean;
  @Column({ name: 'app_access', type: 'bool', default: false })
  appAccess: boolean;
  @Column({ name: 'admin_access', type: 'bool', default: false })
  adminAccess: boolean;
  hasAdminAccess(){
    return this.adminAccess || this.id == UserRole.Admin;
  }
}
