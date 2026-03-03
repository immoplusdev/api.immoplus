import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeFurnitureToFurnitures20260302000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("furnitures");
    const column = table?.findColumnByName("code_furniture");

    if (!column) {
      await queryRunner.query(
        `ALTER TABLE furnitures ADD COLUMN code_furniture VARCHAR(6) NULL`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE furnitures DROP COLUMN code_furniture`,
    );
  }
}
