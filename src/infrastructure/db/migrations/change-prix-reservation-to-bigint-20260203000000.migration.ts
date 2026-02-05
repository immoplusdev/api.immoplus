import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePrixReservationToBigint20260203000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Residences
    await queryRunner.query(
      `ALTER TABLE residences MODIFY COLUMN prix_reservation BIGINT NOT NULL DEFAULT 0`,
    );

    // Reservations
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_total_reservation BIGINT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_commission BIGINT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_paye BIGINT NOT NULL DEFAULT 0`,
    );

    // Biens immobiliers
    await queryRunner.query(
      `ALTER TABLE biens_immobiliers MODIFY COLUMN prix BIGINT`,
    );

    // Demandes visites
    await queryRunner.query(
      `ALTER TABLE demandes_visites MODIFY COLUMN montant_total_demande_visite BIGINT`,
    );
    await queryRunner.query(
      `ALTER TABLE demandes_visites MODIFY COLUMN montant_demande_visite_sans_commission BIGINT`,
    );

    // Payments
    await queryRunner.query(
      `ALTER TABLE payments MODIFY COLUMN amount BIGINT`,
    );
    await queryRunner.query(
      `ALTER TABLE payments MODIFY COLUMN amount_no_fees BIGINT`,
    );

    // Transfers
    await queryRunner.query(
      `ALTER TABLE transfers MODIFY COLUMN amount BIGINT`,
    );
    await queryRunner.query(
      `ALTER TABLE transfers MODIFY COLUMN fees BIGINT`,
    );

    // Wallets
    await queryRunner.query(
      `ALTER TABLE wallets MODIFY COLUMN available_balance BIGINT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE wallets MODIFY COLUMN pending_balance BIGINT NOT NULL DEFAULT 0`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Residences
    await queryRunner.query(
      `ALTER TABLE residences MODIFY COLUMN prix_reservation INT NOT NULL DEFAULT 0`,
    );

    // Reservations
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_total_reservation INT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_commission INT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE reservations MODIFY COLUMN montant_paye INT NOT NULL DEFAULT 0`,
    );

    // Biens immobiliers
    await queryRunner.query(
      `ALTER TABLE biens_immobiliers MODIFY COLUMN prix INT`,
    );

    // Demandes visites
    await queryRunner.query(
      `ALTER TABLE demandes_visites MODIFY COLUMN montant_total_demande_visite INT`,
    );
    await queryRunner.query(
      `ALTER TABLE demandes_visites MODIFY COLUMN montant_demande_visite_sans_commission INT`,
    );

    // Payments
    await queryRunner.query(
      `ALTER TABLE payments MODIFY COLUMN amount INT`,
    );
    await queryRunner.query(
      `ALTER TABLE payments MODIFY COLUMN amount_no_fees INT`,
    );

    // Transfers
    await queryRunner.query(
      `ALTER TABLE transfers MODIFY COLUMN amount DECIMAL(10, 2)`,
    );
    await queryRunner.query(
      `ALTER TABLE transfers MODIFY COLUMN fees DECIMAL(10, 2)`,
    );

    // Wallets
    await queryRunner.query(
      `ALTER TABLE wallets MODIFY COLUMN available_balance DECIMAL(10, 2) NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE wallets MODIFY COLUMN pending_balance DECIMAL(10, 2) NOT NULL DEFAULT 0`,
    );
  }
}
