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

    console.log("Exécution du seeder des communes...\n");

    const communesData = [
      // Abidjan
      { id: uuidv4(), commune: "Abobo", ville: "Abidjan" },
      { id: uuidv4(), commune: "Adjamé", ville: "Abidjan" },
      { id: uuidv4(), commune: "Attécoubé", ville: "Abidjan" },
      { id: uuidv4(), commune: "Cocody", ville: "Abidjan" },
      { id: uuidv4(), commune: "Koumassi", ville: "Abidjan" },
      { id: uuidv4(), commune: "Marcory", ville: "Abidjan" },
      { id: uuidv4(), commune: "Plateau", ville: "Abidjan" },
      { id: uuidv4(), commune: "Port-Bouët", ville: "Abidjan" },
      { id: uuidv4(), commune: "Treichville", ville: "Abidjan" },
      { id: uuidv4(), commune: "Yopougon", ville: "Abidjan" },

      // Autres villes
      { id: uuidv4(), commune: "Bingerville", ville: "Bingerville" },
      { id: uuidv4(), commune: "Anyama", ville: "Anyama" },
      { id: uuidv4(), commune: "Songon", ville: "Songon" },
      { id: uuidv4(), commune: "Yamoussoukro", ville: "Yamoussoukro" },

      // Nord
      { id: uuidv4(), commune: "Korhogo", ville: "Korhogo" },
      { id: uuidv4(), commune: "Boundiali", ville: "Boundiali" },
      { id: uuidv4(), commune: "Ferkessédougou", ville: "Ferkessédougou" },
      { id: uuidv4(), commune: "Kouto", ville: "Kouto" },
      { id: uuidv4(), commune: "Kong", ville: "Kong" },
      { id: uuidv4(), commune: "Odienné", ville: "Odienné" },
      { id: uuidv4(), commune: "Séguéla", ville: "Séguéla" },
      { id: uuidv4(), commune: "Touba", ville: "Touba" },

      // Centre
      { id: uuidv4(), commune: "Bouaké", ville: "Bouaké" },
      { id: uuidv4(), commune: "Toumodi", ville: "Toumodi" },
      { id: uuidv4(), commune: "Tiébissou", ville: "Tiébissou" },
      { id: uuidv4(), commune: "Daloa", ville: "Daloa" },
      { id: uuidv4(), commune: "Bouaflé", ville: "Bouaflé" },
      { id: uuidv4(), commune: "Sinfra", ville: "Sinfra" },
      { id: uuidv4(), commune: "Gagnoa", ville: "Gagnoa" },
      { id: uuidv4(), commune: "Oumé", ville: "Oumé" },

      // Sud
      { id: uuidv4(), commune: "Grand-Bassam", ville: "Grand-Bassam" },
      { id: uuidv4(), commune: "Dabou", ville: "Dabou" },
      { id: uuidv4(), commune: "Agboville", ville: "Agboville" },
      { id: uuidv4(), commune: "Adzopé", ville: "Adzopé" },
      { id: uuidv4(), commune: "Aboisso", ville: "Aboisso" },
      { id: uuidv4(), commune: "Adiaké", ville: "Adiaké" },
      { id: uuidv4(), commune: "Jacqueville", ville: "Jacqueville" },

      // Ouest
      { id: uuidv4(), commune: "Man", ville: "Man" },
      { id: uuidv4(), commune: "Duékoué", ville: "Duékoué" },
      { id: uuidv4(), commune: "Guiglo", ville: "Guiglo" },
      { id: uuidv4(), commune: "Danané", ville: "Danané" },
      { id: uuidv4(), commune: "Bloléquin", ville: "Bloléquin" },
      { id: uuidv4(), commune: "San-Pédro", ville: "San-Pédro" },
      { id: uuidv4(), commune: "Soubré", ville: "Soubré" },
      { id: uuidv4(), commune: "Tabou", ville: "Tabou" },
      { id: uuidv4(), commune: "Sassandra", ville: "Sassandra" },
    ];

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of communesData) {
      try {
        const escapedCommune = item.commune.replace(/'/g, "''");
        const escapedVille = item.ville.replace(/'/g, "''");

        // Vérifier si la ville existe
        const villeResult = await queryRunner.query(
          `SELECT id FROM villes WHERE name = '${escapedVille}' LIMIT 1`,
        );

        if (villeResult.length === 0) {
          console.log(`✗ Ville "${item.ville}" introuvable pour la commune "${item.commune}"`);
          errors++;
          continue;
        }

        const villeId = villeResult[0].id;

        // Insérer la commune avec son ID
        await queryRunner.query(
          `INSERT IGNORE INTO communes (id, name, ville_id) VALUES ('${item.id}', '${escapedCommune}', '${villeId}')`,
        );

        const result = await queryRunner.query(`SELECT ROW_COUNT() as count`);
        if (result[0].count > 0) {
          inserted++;
          console.log(`✓ ${item.commune} (${item.ville}) ajoutée`);
        } else {
          skipped++;
          console.log(`- ${item.commune} (${item.ville}) existe déjà`);
        }
      } catch (error) {
        errors++;
        console.error(`✗ Erreur pour ${item.commune}:`, error.message);
      }
    }

    await queryRunner.release();

    console.log("\n=== Résumé ===");
    console.log(`Total: ${communesData.length} communes`);
    console.log(`Ajoutées: ${inserted}`);
    console.log(`Ignorées (doublons): ${skipped}`);
    console.log(`Erreurs: ${errors}`);
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
