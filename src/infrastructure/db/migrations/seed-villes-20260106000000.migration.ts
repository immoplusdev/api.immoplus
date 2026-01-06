import { MigrationInterface, QueryRunner } from "typeorm";
import { Ville } from "@/core/domain/villes";
import { generateUuid } from "@/lib/ts-utilities/db";

export class SeedVilles20260106000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const villes: Partial<Ville>[] = [
      // Région d'Abidjan
      { id: generateUuid(), name: "Abidjan" },
      { id: generateUuid(), name: "Grand-Bassam" },
      { id: generateUuid(), name: "Bingerville" },
      { id: generateUuid(), name: "Anyama" },
      { id: generateUuid(), name: "Songon" },
      { id: generateUuid(), name: "Dabou" },
      { id: generateUuid(), name: "Jacqueville" },
      { id: generateUuid(), name: "Grand-Lahou" },

      // Région du Sud-Comoé
      { id: generateUuid(), name: "Aboisso" },
      { id: generateUuid(), name: "Adiaké" },
      { id: generateUuid(), name: "Adzopé" },
      { id: generateUuid(), name: "Agboville" },
      { id: generateUuid(), name: "Akoupé" },
      { id: generateUuid(), name: "Alepé" },
      { id: generateUuid(), name: "Tiapoum" },

      // Région des Lacs (Yamoussoukro)
      { id: generateUuid(), name: "Yamoussoukro" },

      // Région du Gbêkê
      { id: generateUuid(), name: "Bouaké" },
      { id: generateUuid(), name: "Toumodi" },
      { id: generateUuid(), name: "Tiébissou" },
      { id: generateUuid(), name: "Didiévi" },
      { id: generateUuid(), name: "Béoumi" },
      { id: generateUuid(), name: "Sakassou" },
      { id: generateUuid(), name: "Botro" },

      // Région du Haut-Sassandra
      { id: generateUuid(), name: "Daloa" },
      { id: generateUuid(), name: "Gagnoa" },
      { id: generateUuid(), name: "Issia" },
      { id: generateUuid(), name: "Sinfra" },
      { id: generateUuid(), name: "Bouaflé" },
      { id: generateUuid(), name: "Oumé" },
      { id: generateUuid(), name: "Vavoua" },
      { id: generateUuid(), name: "Zoukougbeu" },

      // Région des Montagnes
      { id: generateUuid(), name: "Man" },
      { id: generateUuid(), name: "Danané" },
      { id: generateUuid(), name: "Biankouma" },
      { id: generateUuid(), name: "Zouan-Hounien" },
      { id: generateUuid(), name: "Duékoué" },
      { id: generateUuid(), name: "Bangolo" },
      { id: generateUuid(), name: "Guiglo" },
      { id: generateUuid(), name: "Bloléquin" },
      { id: generateUuid(), name: "Toulepleu" },
      { id: generateUuid(), name: "Taï" },

      // Région du Bas-Sassandra
      { id: generateUuid(), name: "San-Pédro" },
      { id: generateUuid(), name: "Sassandra" },
      { id: generateUuid(), name: "Soubré" },
      { id: generateUuid(), name: "Tabou" },
      { id: generateUuid(), name: "Fresco" },
      { id: generateUuid(), name: "Méagui" },
      { id: generateUuid(), name: "Buyo" },
      { id: generateUuid(), name: "Guéyo" },

      // Région du Poro
      { id: generateUuid(), name: "Korhogo" },
      { id: generateUuid(), name: "Ferkessédougou" },
      { id: generateUuid(), name: "Boundiali" },
      { id: generateUuid(), name: "Kouto" },
      { id: generateUuid(), name: "M'Bengué" },
      { id: generateUuid(), name: "Sinématiali" },
      { id: generateUuid(), name: "Dikodougou" },
      { id: generateUuid(), name: "Ouangolodougou" },
      { id: generateUuid(), name: "Kong" },

      // Région du Denguélé
      { id: generateUuid(), name: "Odienné" },
      { id: generateUuid(), name: "Minignan" },
      { id: generateUuid(), name: "Séguéla" },
      { id: generateUuid(), name: "Touba" },
      { id: generateUuid(), name: "Mankono" },
      { id: generateUuid(), name: "Dianra" },
      { id: generateUuid(), name: "Ouaninou" },
    ];

    // Insérer toutes les villes
    for (const ville of villes) {
      // Échapper les apostrophes dans le nom de la ville
      const escapedName = ville.name.replace(/'/g, "''");
      await queryRunner.query(
        `INSERT IGNORE INTO villes (id, name) VALUES ('${ville.id}', '${escapedName}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer toutes les villes (sauf celles qui pourraient avoir des relations)
    await queryRunner.query(`DELETE FROM villes`);
  }
}
