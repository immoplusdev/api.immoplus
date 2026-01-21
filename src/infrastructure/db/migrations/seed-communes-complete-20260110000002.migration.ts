import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCommunesComplete20260110000002 implements MigrationInterface {
  name = "SeedCommunesComplete20260110000002";
  async up(queryRunner: QueryRunner): Promise<void> {
    const communesData = [
      // Région d'Abidjan - Communes détaillées
      { commune: "Abobo", ville: "Abidjan" },
      { commune: "Adjamé", ville: "Abidjan" },
      { commune: "Attécoubé", ville: "Abidjan" },
      { commune: "Cocody", ville: "Abidjan" },
      { commune: "Koumassi", ville: "Abidjan" },
      { commune: "Marcory", ville: "Abidjan" },
      { commune: "Plateau", ville: "Abidjan" },
      { commune: "Port-Bouët", ville: "Abidjan" },
      { commune: "Treichville", ville: "Abidjan" },
      { commune: "Yopougon", ville: "Abidjan" },

      // Autres villes de la région d'Abidjan
      { commune: "Grand-Bassam", ville: "Grand-Bassam" },
      { commune: "Bingerville", ville: "Bingerville" },
      { commune: "Anyama", ville: "Anyama" },
      { commune: "Songon", ville: "Songon" },
      { commune: "Dabou", ville: "Dabou" },
      { commune: "Jacqueville", ville: "Jacqueville" },
      { commune: "Grand-Lahou", ville: "Grand-Lahou" },

      // Région du Sud-Comoé
      { commune: "Aboisso", ville: "Aboisso" },
      { commune: "Adiaké", ville: "Adiaké" },
      { commune: "Adzopé", ville: "Adzopé" },
      { commune: "Agboville", ville: "Agboville" },
      { commune: "Akoupé", ville: "Akoupé" },
      { commune: "Alepé", ville: "Alepé" },
      { commune: "Tiapoum", ville: "Tiapoum" },

      // Région des Lacs
      { commune: "Yamoussoukro", ville: "Yamoussoukro" },

      // Région du Gbêkê
      { commune: "Bouaké", ville: "Bouaké" },
      { commune: "Toumodi", ville: "Toumodi" },
      { commune: "Tiébissou", ville: "Tiébissou" },
      { commune: "Didiévi", ville: "Didiévi" },
      { commune: "Béoumi", ville: "Béoumi" },
      { commune: "Sakassou", ville: "Sakassou" },
      { commune: "Botro", ville: "Botro" },

      // Région du Haut-Sassandra
      { commune: "Daloa", ville: "Daloa" },
      { commune: "Gagnoa", ville: "Gagnoa" },
      { commune: "Issia", ville: "Issia" },
      { commune: "Sinfra", ville: "Sinfra" },
      { commune: "Bouaflé", ville: "Bouaflé" },
      { commune: "Oumé", ville: "Oumé" },
      { commune: "Vavoua", ville: "Vavoua" },
      { commune: "Zoukougbeu", ville: "Zoukougbeu" },

      // Région des Montagnes
      { commune: "Man", ville: "Man" },
      { commune: "Danané", ville: "Danané" },
      { commune: "Biankouma", ville: "Biankouma" },
      { commune: "Zouan-Hounien", ville: "Zouan-Hounien" },
      { commune: "Duékoué", ville: "Duékoué" },
      { commune: "Bangolo", ville: "Bangolo" },
      { commune: "Guiglo", ville: "Guiglo" },
      { commune: "Bloléquin", ville: "Bloléquin" },
      { commune: "Toulepleu", ville: "Toulepleu" },
      { commune: "Taï", ville: "Taï" },

      // Région du Bas-Sassandra
      { commune: "San-Pédro", ville: "San-Pédro" },
      { commune: "Sassandra", ville: "Sassandra" },
      { commune: "Soubré", ville: "Soubré" },
      { commune: "Tabou", ville: "Tabou" },
      { commune: "Fresco", ville: "Fresco" },
      { commune: "Méagui", ville: "Méagui" },
      { commune: "Buyo", ville: "Buyo" },
      { commune: "Guéyo", ville: "Guéyo" },

      // Région du Poro
      { commune: "Korhogo", ville: "Korhogo" },
      { commune: "Ferkessédougou", ville: "Ferkessédougou" },
      { commune: "Boundiali", ville: "Boundiali" },
      { commune: "Kouto", ville: "Kouto" },
      { commune: "M'Bengué", ville: "M'Bengué" },
      { commune: "Sinématiali", ville: "Sinématiali" },
      { commune: "Dikodougou", ville: "Dikodougou" },
      { commune: "Ouangolodougou", ville: "Ouangolodougou" },
      { commune: "Kong", ville: "Kong" },

      // Région du Denguélé
      { commune: "Odienné", ville: "Odienné" },
      { commune: "Minignan", ville: "Minignan" },
      { commune: "Séguéla", ville: "Séguéla" },
      { commune: "Touba", ville: "Touba" },
      { commune: "Mankono", ville: "Mankono" },
      { commune: "Dianra", ville: "Dianra" },
      { commune: "Ouaninou", ville: "Ouaninou" },
    ];

    // Insérer uniquement les communes qui n'existent pas encore
    for (const item of communesData) {
      const escapedCommune = item.commune.replace(/'/g, "''");
      const escapedVille = item.ville.replace(/'/g, "''");

      await queryRunner.query(`
        INSERT INTO communes (id, name, ville_id)
        SELECT UUID(), '${escapedCommune}', v.id
        FROM villes v
        WHERE v.name = '${escapedVille}'
        AND NOT EXISTS (
          SELECT 1 FROM communes c
          WHERE c.name = '${escapedCommune}'
          AND c.ville_id = v.id
        )
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer uniquement les communes ajoutées par cette migration
    await queryRunner.query(`DELETE FROM communes WHERE name IN (
      'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi', 'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
      'Grand-Bassam', 'Bingerville', 'Anyama', 'Songon', 'Dabou', 'Jacqueville', 'Grand-Lahou',
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
