import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Ajoute les champs de traitement vidéo à feed_videos :
 * status (processing/ready/failed), thumbnail_url, duration_ms, width, height,
 * likes_count, view_count.
 * Ajoute aussi l'index composé (created_at DESC, id DESC) pour la pagination cursor-based.
 */
export class AddVideoProcessingFields20260301130000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("feed_videos");
    if (!table) return;

    const hasStatus = table.columns.some((c) => c.name === "status");
    if (!hasStatus) {
      await queryRunner.query(`
        ALTER TABLE \`feed_videos\`
          ADD COLUMN \`status\` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ready',
          ADD COLUMN \`thumbnail_url\` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
          ADD COLUMN \`duration_ms\` int DEFAULT NULL,
          ADD COLUMN \`width\` int DEFAULT NULL,
          ADD COLUMN \`height\` int DEFAULT NULL,
          ADD COLUMN \`likes_count\` int NOT NULL DEFAULT 0,
          ADD COLUMN \`view_count\` int NOT NULL DEFAULT 0
      `);
    }

    // Composite index for cursor-based pagination
    const hasCompositeIdx = table.indices.some(
      (i) => i.name === "IDX_feed_videos_created_at_id",
    );
    if (!hasCompositeIdx) {
      await queryRunner.query(`
        CREATE INDEX \`IDX_feed_videos_created_at_id\`
          ON \`feed_videos\` (\`created_at\` DESC, \`id\` DESC)
      `);
    }

    // Index on status for filtering ready videos
    const hasStatusIdx = table.indices.some(
      (i) => i.name === "IDX_feed_videos_status",
    );
    if (!hasStatusIdx) {
      await queryRunner.query(`
        CREATE INDEX \`IDX_feed_videos_status\` ON \`feed_videos\` (\`status\`)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_feed_videos_status\` ON \`feed_videos\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_feed_videos_created_at_id\` ON \`feed_videos\``,
    );
    await queryRunner.query(`
      ALTER TABLE \`feed_videos\`
        DROP COLUMN \`view_count\`,
        DROP COLUMN \`likes_count\`,
        DROP COLUMN \`height\`,
        DROP COLUMN \`width\`,
        DROP COLUMN \`duration_ms\`,
        DROP COLUMN \`thumbnail_url\`,
        DROP COLUMN \`status\`
    `);
  }
}
