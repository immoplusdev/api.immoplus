import { MigrationInterface, QueryRunner } from "typeorm";
import { generateUuid } from "@/lib/ts-utilities/db";

export class SeedCommunes20260106000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Structure: { id: string, commune: string, ville: string }
    const communesData = [
      // Abidjan
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

      // Autres villes avec communes identiques au nom de la ville
      { id: generateUuid(), commune: "Bingerville", ville: "Bingerville" },
      { id: generateUuid(), commune: "Anyama", ville: "Anyama" },
      { id: generateUuid(), commune: "Songon", ville: "Songon" },
      { id: generateUuid(), commune: "Yamoussoukro", ville: "Yamoussoukro" },

      // Nord
      { id: generateUuid(), commune: "Korhogo", ville: "Korhogo" },
      { id: generateUuid(), commune: "Boundiali", ville: "Boundiali" },
      {
        id: generateUuid(),
        commune: "Ferkessédougou",
        ville: "Ferkessédougou",
      },
      { id: generateUuid(), commune: "Kouto", ville: "Kouto" },
      { id: generateUuid(), commune: "Kong", ville: "Kong" },
      { id: generateUuid(), commune: "Odienné", ville: "Odienné" },
      { id: generateUuid(), commune: "Séguéla", ville: "Séguéla" },
      { id: generateUuid(), commune: "Touba", ville: "Touba" },

      // Centre
      { id: generateUuid(), commune: "Bouaké", ville: "Bouaké" },
      { id: generateUuid(), commune: "Toumodi", ville: "Toumodi" },
      { id: generateUuid(), commune: "Tiébissou", ville: "Tiébissou" },
      { id: generateUuid(), commune: "Daloa", ville: "Daloa" },
      { id: generateUuid(), commune: "Bouaflé", ville: "Bouaflé" },
      { id: generateUuid(), commune: "Sinfra", ville: "Sinfra" },
      { id: generateUuid(), commune: "Gagnoa", ville: "Gagnoa" },
      { id: generateUuid(), commune: "Oumé", ville: "Oumé" },

      // Sud
      { id: generateUuid(), commune: "Grand-Bassam", ville: "Grand-Bassam" },
      { id: generateUuid(), commune: "Dabou", ville: "Dabou" },
      { id: generateUuid(), commune: "Agboville", ville: "Agboville" },
      { id: generateUuid(), commune: "Adzopé", ville: "Adzopé" },
      { id: generateUuid(), commune: "Aboisso", ville: "Aboisso" },
      { id: generateUuid(), commune: "Adiaké", ville: "Adiaké" },
      { id: generateUuid(), commune: "Jacqueville", ville: "Jacqueville" },

      // Ouest
      { id: generateUuid(), commune: "Man", ville: "Man" },
      { id: generateUuid(), commune: "Duékoué", ville: "Duékoué" },
      { id: generateUuid(), commune: "Guiglo", ville: "Guiglo" },
      { id: generateUuid(), commune: "Danané", ville: "Danané" },
      { id: generateUuid(), commune: "Bloléquin", ville: "Bloléquin" },
      { id: generateUuid(), commune: "San-Pédro", ville: "San-Pédro" },
      { id: generateUuid(), commune: "Soubré", ville: "Soubré" },
      { id: generateUuid(), commune: "Tabou", ville: "Tabou" },
      { id: generateUuid(), commune: "Sassandra", ville: "Sassandra" },
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
    await queryRunner.query(`DELETE FROM communes`);
  }
}
