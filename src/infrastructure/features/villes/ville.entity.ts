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

@Entity("villes")
export class VilleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "name", type: "varchar" })
  name: string;


  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
}
