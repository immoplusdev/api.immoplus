import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedVilles20260110000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const villes = [
      // Région d'Abidjan
      "Abidjan",
      "Grand-Bassam",
      "Bingerville",
      "Anyama",
      "Songon",
      "Dabou",
      "Jacqueville",
      "Grand-Lahou",

      // Région du Sud-Comoé
      "Aboisso",
      "Adiaké",
      "Adzopé",
      "Agboville",
      "Akoupé",
      "Alepé",
      "Tiapoum",

      // Région des Lacs (Yamoussoukro)
      "Yamoussoukro",

      // Région du Gbêkê
      "Bouaké",
      "Toumodi",
      "Tiébissou",
      "Didiévi",
      "Béoumi",
      "Sakassou",
      "Botro",

      // Région du Haut-Sassandra
      "Daloa",
      "Gagnoa",
      "Issia",
      "Sinfra",
      "Bouaflé",
      "Oumé",
      "Vavoua",
      "Zoukougbeu",

      // Région des Montagnes
      "Man",
      "Danané",
      "Biankouma",
      "Zouan-Hounien",
      "Duékoué",
      "Bangolo",
      "Guiglo",
      "Bloléquin",
      "Toulepleu",
      "Taï",

      // Région du Bas-Sassandra
      "San-Pédro",
      "Sassandra",
      "Soubré",
      "Tabou",
      "Fresco",
      "Méagui",
      "Buyo",
      "Guéyo",

      // Région du Poro
      "Korhogo",
      "Ferkessédougou",
      "Boundiali",
      "Kouto",
      "M'Bengué",
      "Sinématiali",
      "Dikodougou",
      "Ouangolodougou",
      "Kong",

      // Région du Denguélé
      "Odienné",
      "Minignan",
      "Séguéla",
      "Touba",
      "Mankono",
      "Dianra",
      "Ouaninou",
    ];

    // Insérer uniquement les villes qui n'existent pas encore
    for (const ville of villes) {
      const escapedName = ville.replace(/'/g, "''");

      await queryRunner.query(`
        INSERT INTO villes (id, name)
        SELECT UUID(), '${escapedName}'
        WHERE NOT EXISTS (SELECT 1 FROM villes WHERE name = '${escapedName}')
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Ne pas tout supprimer, juste les villes ajoutées par cette migration
    // Pour être sûr, on pourrait lister les noms, mais ici on fait un rollback complet
    await queryRunner.query(`DELETE FROM villes WHERE name IN (
      'Abidjan', 'Grand-Bassam', 'Bingerville', 'Anyama', 'Songon', 'Dabou', 'Jacqueville', 'Grand-Lahou',
      'Aboisso', 'Adiaké', 'Adzopé', 'Agboville', 'Akoupé', 'Alepé', 'Tiapoum',
      'Yamoussoukro',
      'Bouaké', 'Toumodi', 'Tiébissou', 'Didiévi', 'Béoumi', 'Sakassou', 'Botro',
      'Daloa', 'Gagnoa', 'Issia', 'Sinfra', 'Bouaflé', 'Oumé', 'Vavoua', 'Zoukougbeu',
      'Man', 'Danané', 'Biankouma', 'Zouan-Hounien', 'Duékoué', 'Bangolo', 'Guiglo', 'Bloléquin', 'Toulepleu', 'Taï',
      'San-Pédro', 'Sassandra', 'Soubré', 'Tabou', 'Fresco', 'Méagui', 'Buyo', 'Guéyo',
      'Korhogo', 'Ferkessédougou', 'Boundiali', 'Kouto', 'M''Bengué', 'Sinématiali', 'Dikodougou', 'Ouangolodougou', 'Kong',
      'Odienné', 'Minignan', 'Séguéla', 'Touba', 'Mankono', 'Dianra', 'Ouaninou'
    )`);
  }
}
