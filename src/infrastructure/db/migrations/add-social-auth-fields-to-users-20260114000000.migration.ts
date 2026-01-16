import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSocialAuthFieldsToUsers20260114000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Disable foreign key checks to allow ALTER TABLE on referenced table
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);

    try {
      const table = await queryRunner.getTable("users");

      // Make password column nullable (required for social auth users)
      await queryRunner.query(
        `ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL`,
      );

      // Add google_id column
      const googleIdColumn = table?.findColumnByName("google_id");
      if (!googleIdColumn) {
        await queryRunner.query(
          `ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE`,
        );
      }

      // Add facebook_id column
      const facebookIdColumn = table?.findColumnByName("facebook_id");
      if (!facebookIdColumn) {
        await queryRunner.query(
          `ALTER TABLE users ADD COLUMN facebook_id VARCHAR(255) NULL UNIQUE`,
        );
      }
    } finally {
      // Re-enable foreign key checks
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN facebook_id`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN google_id`);
  }
}
