import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPinHashToWallets20251007005756 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("wallets");
    const column = table?.findColumnByName("pin_hash");

    if (!column) {
      await queryRunner.query(
        `ALTER TABLE wallets ADD COLUMN pin_hash VARCHAR(255) NULL`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE wallets DROP COLUMN pin_hash`);
  }
}
