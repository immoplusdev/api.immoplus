import { DataSource } from "typeorm";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";

// Charger les variables d'environnement
config();

async function runSeed() {
  const dataSource = new DataSource({
    type: process.env.DB_CLIENT as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    console.log("Initialisation de la connexion à la base de données...");
    await dataSource.initialize();
    console.log("Connexion établie ✓");

    console.log("Exécution du seeder des villes...");

    const villes = [
      // Région d'Abidjan
      { id: uuidv4(), name: "Abidjan" },
      { id: uuidv4(), name: "Grand-Bassam" },
      { id: uuidv4(), name: "Bingerville" },
      { id: uuidv4(), name: "Anyama" },
      { id: uuidv4(), name: "Songon" },
      { id: uuidv4(), name: "Dabou" },
      { id: uuidv4(), name: "Jacqueville" },
      { id: uuidv4(), name: "Grand-Lahou" },

      // Région du Sud-Comoé
      { id: uuidv4(), name: "Aboisso" },
      { id: uuidv4(), name: "Adiaké" },
      { id: uuidv4(), name: "Adzopé" },
      { id: uuidv4(), name: "Agboville" },
      { id: uuidv4(), name: "Akoupé" },
      { id: uuidv4(), name: "Alepé" },
      { id: uuidv4(), name: "Tiapoum" },

      // Région des Lacs (Yamoussoukro)
      { id: uuidv4(), name: "Yamoussoukro" },

      // Région du Gbêkê
      { id: uuidv4(), name: "Bouaké" },
      { id: uuidv4(), name: "Toumodi" },
      { id: uuidv4(), name: "Tiébissou" },
      { id: uuidv4(), name: "Didiévi" },
      { id: uuidv4(), name: "Béoumi" },
      { id: uuidv4(), name: "Sakassou" },
      { id: uuidv4(), name: "Botro" },

      // Région du Haut-Sassandra
      { id: uuidv4(), name: "Daloa" },
      { id: uuidv4(), name: "Gagnoa" },
      { id: uuidv4(), name: "Issia" },
      { id: uuidv4(), name: "Sinfra" },
      { id: uuidv4(), name: "Bouaflé" },
      { id: uuidv4(), name: "Oumé" },
      { id: uuidv4(), name: "Vavoua" },
      { id: uuidv4(), name: "Zoukougbeu" },

      // Région des Montagnes
      { id: uuidv4(), name: "Man" },
      { id: uuidv4(), name: "Danané" },
      { id: uuidv4(), name: "Biankouma" },
      { id: uuidv4(), name: "Zouan-Hounien" },
      { id: uuidv4(), name: "Duékoué" },
      { id: uuidv4(), name: "Bangolo" },
      { id: uuidv4(), name: "Guiglo" },
      { id: uuidv4(), name: "Bloléquin" },
      { id: uuidv4(), name: "Toulepleu" },
      { id: uuidv4(), name: "Taï" },

      // Région du Bas-Sassandra
      { id: uuidv4(), name: "San-Pédro" },
      { id: uuidv4(), name: "Sassandra" },
      { id: uuidv4(), name: "Soubré" },
      { id: uuidv4(), name: "Tabou" },
      { id: uuidv4(), name: "Fresco" },
      { id: uuidv4(), name: "Méagui" },
      { id: uuidv4(), name: "Buyo" },
      { id: uuidv4(), name: "Guéyo" },

      // Région du Poro
      { id: uuidv4(), name: "Korhogo" },
      { id: uuidv4(), name: "Ferkessédougou" },
      { id: uuidv4(), name: "Boundiali" },
      { id: uuidv4(), name: "Kouto" },
      { id: uuidv4(), name: "M'Bengué" },
      { id: uuidv4(), name: "Sinématiali" },
      { id: uuidv4(), name: "Dikodougou" },
      { id: uuidv4(), name: "Ouangolodougou" },
      { id: uuidv4(), name: "Kong" },

      // Région du Denguélé
      { id: uuidv4(), name: "Odienné" },
      { id: uuidv4(), name: "Minignan" },
      { id: uuidv4(), name: "Séguéla" },
      { id: uuidv4(), name: "Touba" },
      { id: uuidv4(), name: "Mankono" },
      { id: uuidv4(), name: "Dianra" },
      { id: uuidv4(), name: "Ouaninou" },
    ];

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    let inserted = 0;
    let skipped = 0;

    for (const ville of villes) {
      try {
        // Échapper les apostrophes dans le nom de la ville
        const escapedName = ville.name.replace(/'/g, "''");
        await queryRunner.query(
          `INSERT IGNORE INTO villes (id, name) VALUES ('${ville.id}', '${escapedName}')`,
        );
        const result = await queryRunner.query(`SELECT ROW_COUNT() as count`);
        if (result[0].count > 0) {
          inserted++;
          console.log(`✓ ${ville.name} ajoutée`);
        } else {
          skipped++;
          console.log(`- ${ville.name} existe déjà`);
        }
      } catch (error) {
        console.error(`✗ Erreur pour ${ville.name}:`, error.message);
      }
    }

    await queryRunner.release();

    console.log("\n=== Résumé ===");
    console.log(`Total: ${villes.length} villes`);
    console.log(`Ajoutées: ${inserted}`);
    console.log(`Ignorées (doublons): ${skipped}`);
    console.log("Seeder exécuté avec succès ✓");

    await dataSource.destroy();
    console.log("Connexion fermée ✓");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'exécution du seeder:", error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

runSeed();
