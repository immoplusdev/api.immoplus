import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppleIdToUsers20260221000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);

    try {
      const table = await queryRunner.getTable("users");

      const appleIdColumn = table?.findColumnByName("apple_id");
      if (!appleIdColumn) {
        await queryRunner.query(
          `ALTER TABLE users ADD COLUMN apple_id VARCHAR(255) NULL UNIQUE`,
        );
      }
    } finally {
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN apple_id`);
  }
}
