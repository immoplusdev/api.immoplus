import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeCategoryEtatToFurnitures20260215000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("furnitures");
    if (!table) return;

    const hasType = table.findColumnByName("type");
    const hasCategory = table.findColumnByName("category");
    const hasEtat = table.findColumnByName("etat");

    if (!hasType) {
      await queryRunner.query(
        "ALTER TABLE furnitures ADD COLUMN type VARCHAR(255) NULL",
      );
    }

    if (!hasCategory) {
      await queryRunner.query(
        "ALTER TABLE furnitures ADD COLUMN category VARCHAR(255) NULL",
      );
    }

    if (!hasEtat) {
      await queryRunner.query(
        "ALTER TABLE furnitures ADD COLUMN etat VARCHAR(255) NULL",
      );
    }

    await queryRunner.query(`
      UPDATE furnitures
      SET
        type = COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.types[0]')), ''), 'non-specifie'),
        category = COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.categories[0]')), ''), 'non-specifie'),
        etat = COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.etat')), ''), 'occasion')
      WHERE
        type IS NULL OR category IS NULL OR etat IS NULL
    `);

    await queryRunner.query(`
      UPDATE furnitures
      SET etat = 'occasion'
      WHERE etat NOT IN ('neuf', 'reconditionne', 'occasion')
    `);

    await queryRunner.query(`
      UPDATE furnitures
      SET metadata = CASE
        WHEN metadata IS NULL THEN NULL
        WHEN JSON_EXTRACT(metadata, '$.colors') IS NULL THEN JSON_OBJECT()
        ELSE JSON_OBJECT('colors', JSON_EXTRACT(metadata, '$.colors'))
      END
    `);

    await queryRunner.query(`
      ALTER TABLE furnitures
      MODIFY COLUMN type VARCHAR(255) NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE furnitures
      MODIFY COLUMN category VARCHAR(255) NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE furnitures
      MODIFY COLUMN etat VARCHAR(255) NOT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("furnitures");
    if (!table) return;

    const hasType = table.findColumnByName("type");
    const hasCategory = table.findColumnByName("category");
    const hasEtat = table.findColumnByName("etat");

    if (hasType) {
      await queryRunner.query("ALTER TABLE furnitures DROP COLUMN type");
    }

    if (hasCategory) {
      await queryRunner.query("ALTER TABLE furnitures DROP COLUMN category");
    }

    if (hasEtat) {
      await queryRunner.query("ALTER TABLE furnitures DROP COLUMN etat");
    }
  }
}
