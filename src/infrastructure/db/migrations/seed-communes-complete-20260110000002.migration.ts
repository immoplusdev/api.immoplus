import { MigrationInterface, QueryRunner } from "typeorm";
import { generateUuid } from "@/lib/ts-utilities/db";

export class SeedCommunesComplete20260110000002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const communesData = [
      // Région d'Abidjan - Communes détaillées
      { id: generateUuid(), commune: "Abobo", ville: "Abidjan" },
      { id: generateUuid(), commune: "Adjamé", ville: "Abidjan" },
      { id: generateUuid(), commune: "Attécoubé", ville: "Abidjan" },
      { id: generateUuid(), commune: "Cocody", ville: "Abidjan" },
      { id: generateUuid(), commune: "Koumassi", ville: "Abidjan" },
      { id: generateUuid(), commune: "Marcory", ville: "Abidjan" },
      { id: generateUuid(), commune: "Plateau", ville: "Abidjan" },
      { id: generateUuid(), commune: "Port-Bouët", ville: "Abidjan" },
      { id: generateUuid(), commune: "Treichville", ville: "Abidjan" },
      { id: generateUuid(), commune: "Yopougon", ville: "Abidjan" },

      // Autres villes de la région d'Abidjan
      { id: generateUuid(), commune: "Grand-Bassam", ville: "Grand-Bassam" },
      { id: generateUuid(), commune: "Bingerville", ville: "Bingerville" },
      { id: generateUuid(), commune: "Anyama", ville: "Anyama" },
      { id: generateUuid(), commune: "Songon", ville: "Songon" },
      { id: generateUuid(), commune: "Dabou", ville: "Dabou" },
      { id: generateUuid(), commune: "Jacqueville", ville: "Jacqueville" },
      { id: generateUuid(), commune: "Grand-Lahou", ville: "Grand-Lahou" },

      // Région du Sud-Comoé
      { id: generateUuid(), commune: "Aboisso", ville: "Aboisso" },
      { id: generateUuid(), commune: "Adiaké", ville: "Adiaké" },
      { id: generateUuid(), commune: "Adzopé", ville: "Adzopé" },
      { id: generateUuid(), commune: "Agboville", ville: "Agboville" },
      { id: generateUuid(), commune: "Akoupé", ville: "Akoupé" },
      { id: generateUuid(), commune: "Alepé", ville: "Alepé" },
      { id: generateUuid(), commune: "Tiapoum", ville: "Tiapoum" },

      // Région des Lacs
      { id: generateUuid(), commune: "Yamoussoukro", ville: "Yamoussoukro" },

      // Région du Gbêkê
      { id: generateUuid(), commune: "Bouaké", ville: "Bouaké" },
      { id: generateUuid(), commune: "Toumodi", ville: "Toumodi" },
      { id: generateUuid(), commune: "Tiébissou", ville: "Tiébissou" },
      { id: generateUuid(), commune: "Didiévi", ville: "Didiévi" },
      { id: generateUuid(), commune: "Béoumi", ville: "Béoumi" },
      { id: generateUuid(), commune: "Sakassou", ville: "Sakassou" },
      { id: generateUuid(), commune: "Botro", ville: "Botro" },

      // Région du Haut-Sassandra
      { id: generateUuid(), commune: "Daloa", ville: "Daloa" },
      { id: generateUuid(), commune: "Gagnoa", ville: "Gagnoa" },
      { id: generateUuid(), commune: "Issia", ville: "Issia" },
      { id: generateUuid(), commune: "Sinfra", ville: "Sinfra" },
      { id: generateUuid(), commune: "Bouaflé", ville: "Bouaflé" },
      { id: generateUuid(), commune: "Oumé", ville: "Oumé" },
      { id: generateUuid(), commune: "Vavoua", ville: "Vavoua" },
      { id: generateUuid(), commune: "Zoukougbeu", ville: "Zoukougbeu" },

      // Région des Montagnes
      { id: generateUuid(), commune: "Man", ville: "Man" },
      { id: generateUuid(), commune: "Danané", ville: "Danané" },
      { id: generateUuid(), commune: "Biankouma", ville: "Biankouma" },
      { id: generateUuid(), commune: "Zouan-Hounien", ville: "Zouan-Hounien" },
      { id: generateUuid(), commune: "Duékoué", ville: "Duékoué" },
      { id: generateUuid(), commune: "Bangolo", ville: "Bangolo" },
      { id: generateUuid(), commune: "Guiglo", ville: "Guiglo" },
      { id: generateUuid(), commune: "Bloléquin", ville: "Bloléquin" },
      { id: generateUuid(), commune: "Toulepleu", ville: "Toulepleu" },
      { id: generateUuid(), commune: "Taï", ville: "Taï" },

      // Région du Bas-Sassandra
      { id: generateUuid(), commune: "San-Pédro", ville: "San-Pédro" },
      { id: generateUuid(), commune: "Sassandra", ville: "Sassandra" },
      { id: generateUuid(), commune: "Soubré", ville: "Soubré" },
      { id: generateUuid(), commune: "Tabou", ville: "Tabou" },
      { id: generateUuid(), commune: "Fresco", ville: "Fresco" },
      { id: generateUuid(), commune: "Méagui", ville: "Méagui" },
      { id: generateUuid(), commune: "Buyo", ville: "Buyo" },
      { id: generateUuid(), commune: "Guéyo", ville: "Guéyo" },

      // Région du Poro
      { id: generateUuid(), commune: "Korhogo", ville: "Korhogo" },
      {
        id: generateUuid(),
        commune: "Ferkessédougou",
        ville: "Ferkessédougou",
      },
      { id: generateUuid(), commune: "Boundiali", ville: "Boundiali" },
      { id: generateUuid(), commune: "Kouto", ville: "Kouto" },
      { id: generateUuid(), commune: "M'Bengué", ville: "M'Bengué" },
      { id: generateUuid(), commune: "Sinématiali", ville: "Sinématiali" },
      { id: generateUuid(), commune: "Dikodougou", ville: "Dikodougou" },
      {
        id: generateUuid(),
        commune: "Ouangolodougou",
        ville: "Ouangolodougou",
      },
      { id: generateUuid(), commune: "Kong", ville: "Kong" },

      // Région du Denguélé
      { id: generateUuid(), commune: "Odienné", ville: "Odienné" },
      { id: generateUuid(), commune: "Minignan", ville: "Minignan" },
      { id: generateUuid(), commune: "Séguéla", ville: "Séguéla" },
      { id: generateUuid(), commune: "Touba", ville: "Touba" },
      { id: generateUuid(), commune: "Mankono", ville: "Mankono" },
      { id: generateUuid(), commune: "Dianra", ville: "Dianra" },
      { id: generateUuid(), commune: "Ouaninou", ville: "Ouaninou" },
    ];

    // Construire la requête INSERT avec UNION ALL
    const selectStatements = communesData.map((item) => {
      const escapedCommune = item.commune.replace(/'/g, "''");
      const escapedVille = item.ville.replace(/'/g, "''");
      return `SELECT '${item.id}' as id, '${escapedCommune}' as name, v.id as ville_id FROM villes v WHERE v.name = '${escapedVille}'`;
    });

    const insertQuery = `
      INSERT IGNORE INTO communes (id, name, ville_id)
      ${selectStatements.join("\nUNION ALL\n")}
    `;

    await queryRunner.query(insertQuery);
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
