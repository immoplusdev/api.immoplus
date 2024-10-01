import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, RelationId,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "@/infrastructure/features/users";
import { VilleEntity } from "@/infrastructure/features/villes";
import { Ville } from "@/core/domain/villes";
import { OmitMethods } from "@/lib/ts-utilities";

@Entity("communes")
export class CommuneEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "name", type: "varchar" })
  name: string;

  @ManyToOne(() => VilleEntity, (entity) => entity.id)
  @JoinColumn({ name: "ville_id" })
  ville: Ville;

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

  constructor(data?: OmitMethods<CommuneEntity>) {
    if (data) Object.assign(this, data);
  }
}
