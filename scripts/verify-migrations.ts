import { DataSource } from "typeorm";
import { config } from "dotenv";

// Charger les variables d'environnement
config();

async function verifyMigrations() {
  const dataSource = new DataSource({
    type: process.env.DB_CLIENT as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    console.log("========================================");
    console.log("🔍 Vérification des Migrations");
    console.log("========================================\n");

    console.log("📡 Connexion à la base de données...");
    await dataSource.initialize();
    console.log("✅ Connexion établie\n");

    // Vérifier les migrations exécutées
    console.log("📋 Migrations exécutées:");
    console.log("----------------------------------------");
    const migrations = await dataSource.query(
      "SELECT * FROM typeorm_migrations ORDER BY timestamp DESC LIMIT 10"
    );

    if (migrations.length === 0) {
      console.log("⚠️  Aucune migration trouvée!");
    } else {
      migrations.forEach((m: any) => {
        const date = new Date(m.timestamp);
        console.log(`✓ ${m.name} (${date.toLocaleDateString()})`);
      });
    }
    console.log("");

    // Vérifier les villes
    console.log("🏙️  Villes:");
    console.log("----------------------------------------");
    const villesCount = await dataSource.query(
      "SELECT COUNT(*) as count FROM villes"
    );
    const expectedVilles = 73;
    const actualVilles = villesCount[0].count;

    if (actualVilles >= expectedVilles) {
      console.log(`✅ ${actualVilles} villes trouvées (attendu: ${expectedVilles})`);
    } else {
      console.log(`⚠️  ${actualVilles} villes trouvées (attendu: ${expectedVilles})`);
      console.log("💡 Conseil: Exécutez la migration seed-villes-20260110000001");
    }

    // Afficher quelques villes
    const sampleVilles = await dataSource.query(
      "SELECT name FROM villes ORDER BY name LIMIT 5"
    );
    console.log("   Exemples:", sampleVilles.map((v: any) => v.name).join(", "));
    console.log("");

    // Vérifier les communes
    console.log("🏘️  Communes:");
    console.log("----------------------------------------");
    const communesCount = await dataSource.query(
      "SELECT COUNT(*) as count FROM communes"
    );
    const expectedCommunes = 73;
    const actualCommunes = communesCount[0].count;

    if (actualCommunes >= expectedCommunes) {
      console.log(`✅ ${actualCommunes} communes trouvées (attendu: ${expectedCommunes})`);
    } else if (actualCommunes >= 42) {
      console.log(`⚠️  ${actualCommunes} communes trouvées (attendu: ${expectedCommunes})`);
      console.log("💡 Conseil: Seule la migration partielle a été exécutée");
      console.log("   Exécutez: npm run migrate pour obtenir toutes les communes");
    } else {
      console.log(`❌ ${actualCommunes} communes trouvées (attendu: ${expectedCommunes})`);
      console.log("💡 Conseil: Exécutez npm run migrate");
    }

    // Afficher quelques communes
    const sampleCommunes = await dataSource.query(
      "SELECT c.name, v.name as ville FROM communes c JOIN villes v ON c.ville_id = v.id ORDER BY c.name LIMIT 5"
    );
    console.log("   Exemples:");
    sampleCommunes.forEach((c: any) => {
      console.log(`   - ${c.name} (${c.ville})`);
    });
    console.log("");

    // Vérifier les villes sans communes
    console.log("🔍 Villes sans communes:");
    console.log("----------------------------------------");
    const villesSansCommunes = await dataSource.query(`
      SELECT v.name
      FROM villes v
      LEFT JOIN communes c ON c.ville_id = v.id
      WHERE c.id IS NULL
      ORDER BY v.name
    `);

    if (villesSansCommunes.length === 0) {
      console.log("✅ Toutes les villes ont au moins une commune");
    } else {
      console.log(`⚠️  ${villesSansCommunes.length} villes sans commune:`);
      villesSansCommunes.forEach((v: any) => {
        console.log(`   - ${v.name}`);
      });
      console.log("\n💡 Conseil: Exécutez la migration complète des communes");
    }
    console.log("");

    // Statistiques par région (basé sur Abidjan comme exemple)
    console.log("📊 Statistiques Abidjan:");
    console.log("----------------------------------------");
    const abidjanCommunes = await dataSource.query(`
      SELECT COUNT(*) as count
      FROM communes c
      JOIN villes v ON c.ville_id = v.id
      WHERE v.name = 'Abidjan'
    `);
    const expectedAbidjanCommunes = 10;
    const actualAbidjanCommunes = abidjanCommunes[0].count;

    if (actualAbidjanCommunes === expectedAbidjanCommunes) {
      console.log(`✅ ${actualAbidjanCommunes} communes (attendu: ${expectedAbidjanCommunes})`);
    } else {
      console.log(`⚠️  ${actualAbidjanCommunes} communes (attendu: ${expectedAbidjanCommunes})`);
    }

    const abidjanCommunesList = await dataSource.query(`
      SELECT c.name
      FROM communes c
      JOIN villes v ON c.ville_id = v.id
      WHERE v.name = 'Abidjan'
      ORDER BY c.name
    `);
    console.log("   Communes:", abidjanCommunesList.map((c: any) => c.name).join(", "));
    console.log("");

    // Résumé final
    console.log("========================================");
    console.log("📈 Résumé");
    console.log("========================================");

    let issues = 0;
    if (actualVilles < expectedVilles) issues++;
    if (actualCommunes < expectedCommunes) issues++;
    if (villesSansCommunes.length > 0) issues++;
    if (actualAbidjanCommunes !== expectedAbidjanCommunes) issues++;

    if (issues === 0) {
      console.log("✅ Toutes les vérifications sont passées!");
      console.log("🎉 Vos migrations sont correctement exécutées.");
    } else {
      console.log(`⚠️  ${issues} problème(s) détecté(s)`);
      console.log("\n💡 Suggestions:");
      console.log("   1. Exécutez: npm run migrate");
      console.log("   2. Ou dans Docker: docker-compose exec api npm run migrate");
      console.log("   3. Vérifiez que DB_MIGRATION_RUN=true dans votre .env ou docker-compose.yml");
    }
    console.log("");

    await dataSource.destroy();
    console.log("🔌 Connexion fermée");
    process.exit(issues === 0 ? 0 : 1);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

verifyMigrations();
