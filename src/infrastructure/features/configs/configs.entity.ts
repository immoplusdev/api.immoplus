import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FileEntity } from "@/infrastructure/features/files";

@Entity('configurations')
export class AppConfigsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: "website_url", type: "varchar", nullable: true })
  websiteUrl: string;
  @Column({ name: "normal_visit_price", type: "int", nullable: true })
  normalVisitPrice: number;
  @Column({ name: "pourcentage_commission_reservation", type: "int", default: 5 })
  pourcentageCommissionReservation: number;
  @Column({ name: "express_visit_price", type: "int", nullable: true })
  expressVisitPrice: number;
  @Column({ name: "project_name", type: "varchar", nullable: true })
  projectName: string;
  @Column({ name: "project_url", type: "varchar", nullable: true })
  projectUrl: string;


  @ManyToOne(() => FileEntity,item=> item.id, { nullable: true })
  @JoinColumn({ name: "project_logo_id" })
  projectLogo: string;

  @Column({ name: "sms_sender_name", type: "varchar", nullable: true })
  smsSenderName: string;
  @Column({ name: "proximity_radius", type: "int", nullable: true })
  proximityRadius: number;
  @Column({ name: "standard_shipping_price", type: "int", nullable: true })
  standardShippingPrice: number;
  @Column({ name: "flash_shipping_price", type: "int", nullable: true })
  flashShippingPrice: number;
  @Column({ name: "contact_email", type: "varchar", nullable: true })
  contactEmail: string;
  @Column({ name: "contact_phone_number", type: "varchar", nullable: true })
  contactPhoneNumber: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
}
