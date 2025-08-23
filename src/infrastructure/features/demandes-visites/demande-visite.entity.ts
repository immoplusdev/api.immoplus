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
import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/common/models";
import { StatusFacture } from "@/core/domain/payments";
import { UserEntity } from "@/infrastructure/features/users";
import {
  StatusDemandeVisite,
  TypeDemandeVisite,
} from "@/core/domain/demandes-visites";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierEntity } from "@/infrastructure/features/biens-immobiliers";

@Entity("demandes_visites")
export class DemandeVisiteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => BienImmobilierEntity, (item) => item.id, { nullable: true })
  @JoinColumn({ name: "bien_immobilier_id" })
  bienImmobilier: BienImmobilier | string;

  @Column({
    name: "status_demande_visite",
    type: "varchar",
    length: 30,
    default: StatusDemandeVisite.EnCours,
  })
  statusDemandeVisite: StatusDemandeVisite;

  @Column({
    name: "type_demande_visite",
    type: "varchar",
    length: 30,
    default: TypeDemandeVisite.Normal,
  })
  typeDemandeVisite: TypeDemandeVisite;

  @Column({ name: "dates_demande_visite", type: "json" })
  datesDemandeVisite: ServiceDates;
  @Column({
    name: "status_facture",
    type: "varchar",
    length: 10,
    default: StatusFacture.NonPaye,
  })
  statusFacture: StatusFacture;

  @Column({ name: "retrait_pro_effectue", type: "bool", default: false })
  retraitProEffectue: boolean;
  @Column({ name: "montant_total_demande_visite", type: "int" })
  montantTotalDemandeVisite: number;
  @Column({ name: "montant_demande_visite_sans_commission", type: "int" })
  montantCommission: number;

  @Column({ name: "notes", type: "text", nullable: true })
  notes: string;

  @Column({
    name: "customer_phone_number",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  clientPhoneNumber: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<DemandeVisiteEntity>) {
    if (data) Object.assign(this, data);
  }
}
