import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Crée la table video_likes pour les likes de vidéos feed.
 * Contrainte unique sur (user_id, video_id) pour garantir un like par user par vidéo.
 */
export class CreateVideoLikesTable20260301140000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.getTable("video_likes");
    if (existing) return;

    await queryRunner.query(`
      CREATE TABLE \`video_likes\` (
        \`user_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`video_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`user_id\`, \`video_id\`),
        INDEX \`IDX_video_likes_video_id\` (\`video_id\`),
        CONSTRAINT \`FK_video_likes_video_id\` FOREIGN KEY (\`video_id\`) REFERENCES \`feed_videos\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_video_likes_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS `video_likes`");
  }
}
