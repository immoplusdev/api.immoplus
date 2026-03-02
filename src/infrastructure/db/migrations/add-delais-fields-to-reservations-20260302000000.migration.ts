import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDelaisFieldsToReservations20260302000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE reservations ADD COLUMN delais_pro_reponse TIMESTAMP NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations ADD COLUMN delais_paiement_client TIMESTAMP NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE reservations DROP COLUMN delais_paiement_client`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations DROP COLUMN delais_pro_reponse`,
    );
  }
}
