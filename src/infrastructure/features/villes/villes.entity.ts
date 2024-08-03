import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "@/infrastructure/features/users";

@Entity('villes')
export class VilleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: "name", type: "varchar" })
  name: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @Column({ name: "created_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @Column({ name: "updated_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "updated_by" })
  updatedBy?:  string;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
  @Column({ name: "deleted_by", type: "uuid", nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "deleted_by" })
  deletedBy?:  string;
}
