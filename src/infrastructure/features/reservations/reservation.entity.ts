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
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { StatusReservation } from "@/core/domain/reservations";
import { ServiceDates } from "@/core/domain/common/models";
import { StatusFacture } from "@/core/domain/payments/status-facture.enum";
import { UserEntity } from "@/infrastructure/features/users";
import { Residence } from "@/core/domain/residences";
import { OmitMethods } from "@/lib/ts-utilities";

@Entity("reservations")
export class ReservationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ResidenceEntity, (item) => item.id, { nullable: true })
  @JoinColumn({ name: "residence_id" })
  residence: Residence | string;

  @Column({
    name: "status_reservation",
    type: "varchar",
    length: 30,
    default: StatusReservation.EnCours,
  })
  statusReservation: StatusReservation;
  @Column({ name: "dates_reservation", type: "json" })
  datesReservation: ServiceDates;

  @Column({ name: "date_debut", nullable: true })
  dateDebut: Date;

  @Column({ name: "date_fin", nullable: true })
  dateFin: Date;

  @Column({
    name: "status_facture",
    type: "varchar",
    length: 10,
    default: StatusFacture.NonPaye,
  })
  statusFacture: StatusFacture;

  @Column({ name: "retrait_pro_effectue", type: "bool", default: false })
  retraitProEffectue: boolean;
  @Column({ name: "montant_total_reservation", type: "int" })
  montantTotalReservation: number;
  @Column({ name: "montant_commission", type: "int" })
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

  constructor(data?: OmitMethods<ReservationEntity>) {
    if (data) Object.assign(this, data);
  }
}
