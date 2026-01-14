import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMontantPayeToReservations20251018000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("reservations");
    const column = table?.findColumnByName("montant_paye");

    if (!column) {
      await queryRunner.query(
        `ALTER TABLE reservations ADD COLUMN montant_paye INT NOT NULL DEFAULT 0`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE reservations DROP COLUMN montant_paye`,
    );
  }
}
