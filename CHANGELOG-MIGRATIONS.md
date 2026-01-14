# Changelog - Migrations Villes et Communes

## [2026-01-10] - Mise en place des migrations complètes

### ✨ Ajouté

#### 1. Migration complète des villes
- **Fichier** : `src/infrastructure/db/migrations/seed-villes-20260110000001.migration.ts`
- **Contenu** : 73 villes de toutes les régions de Côte d'Ivoire
- **Regions couvertes** :
  - Région d'Abidjan (8 villes)
  - Région du Sud-Comoé (7 villes)
  - Région des Lacs (1 ville)
  - Région du Gbêkê (7 villes)
  - Région du Haut-Sassandra (8 villes)
  - Région des Montagnes (10 villes)
  - Région du Bas-Sassandra (8 villes)
  - Région du Poro (9 villes)
  - Région du Denguélé (7 villes)

#### 2. Migration complète des communes
- **Fichier** : `src/infrastructure/db/migrations/seed-communes-complete-20260110000002.migration.ts`
- **Contenu** : 73 communes (une pour chaque ville)
- **Spécial** :
  - Abidjan possède 10 communes détaillées (Abobo, Adjamé, Attécoubé, Cocody, etc.)
  - Les autres villes ont chacune une commune principale portant le même nom

#### 3. Configuration Docker automatique
- **Modification** : `docker-compose.yml`
- **Changement** : Ajout de `DB_MIGRATION_RUN=true` dans la section environment
- **Résultat** : Les migrations s'exécutent automatiquement au démarrage du conteneur

#### 4. Documentation complète
- **Fichier** : `MIGRATIONS.md`
- Guide complet d'utilisation des migrations
- Instructions de vérification et troubleshooting
- Commandes SQL pour valider les données

### 🔄 Modifié

#### Migration ancienne des communes
- **Fichier** : `src/infrastructure/db/migrations/seed-communes-20260106000001.migration.ts`
- **Statut** : Conservée pour la compatibilité
- **Note** : Utilise `INSERT IGNORE`, donc pas de conflit avec la nouvelle migration

### 📊 Statistiques

| Élément | Avant | Après |
|---------|-------|-------|
| Villes | 3 (migration partielle) | 73 (complète) |
| Communes | 42 (migration partielle) | 73 (complète) |
| Regions couvertes | 2 | 9 |
| Exécution | Manuelle uniquement | Automatique + Manuelle |

### 🚀 Impact

#### Pour le développement
- ✅ Démarrage simplifié : `docker-compose up --build`
- ✅ Pas besoin d'exécuter manuellement les seeders
- ✅ Données cohérentes dans tous les environnements

#### Pour la production
- ✅ Déploiement automatisé
- ✅ Pas de risque d'oublier les données de base
- ✅ Rollback possible si nécessaire

### 🧪 Comment tester

```bash
# 1. Rebuild le conteneur
docker-compose down
docker-compose up --build

# 2. Vérifier les logs
docker-compose logs -f api | grep migration

# 3. Vérifier les données
docker-compose exec api sh -c "node -e \"
const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  const [villes] = await conn.query('SELECT COUNT(*) as count FROM villes');
  const [communes] = await conn.query('SELECT COUNT(*) as count FROM communes');
  console.log('Villes:', villes[0].count);
  console.log('Communes:', communes[0].count);
  await conn.end();
})();
\""
```

### 📝 Notes importantes

1. **Compatibilité** : Les anciennes migrations sont conservées pour éviter les conflits avec les bases de données existantes.

2. **INSERT IGNORE** : Toutes les migrations utilisent `INSERT IGNORE` pour éviter les doublons, donc elles peuvent être exécutées plusieurs fois sans problème.

3. **Ordre d'exécution** : TypeORM exécute les migrations dans l'ordre chronologique basé sur le timestamp dans le nom du fichier.

4. **Scripts manuels conservés** : Les scripts `run-seed-villes.ts` et `run-seed-communes.ts` sont conservés pour une exécution manuelle si nécessaire.

### 🔜 Prochaines étapes recommandées

1. ⬜ Ajouter des communes supplémentaires pour les grandes villes (ex: Bouaké, Korhogo)
2. ⬜ Créer une migration pour les quartiers par commune
3. ⬜ Ajouter des tests automatisés pour valider les migrations
4. ⬜ Documenter la structure géographique complète (Région > Ville > Commune > Quartier)

### 🐛 Problèmes connus

Aucun problème connu pour le moment.

### 🔗 Références

- Script original villes : `scripts/run-seed-villes.ts`
- Script original communes : `scripts/run-seed-communes.ts`
- Documentation : `MIGRATIONS.md`
- Configuration Docker : `docker-compose.yml`
