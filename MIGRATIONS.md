# Guide des Migrations - Villes et Communes

## Vue d'ensemble

Ce projet utilise TypeORM pour gérer les migrations de base de données. Les données des villes et communes de Côte d'Ivoire sont automatiquement insérées via des migrations.

## Migrations disponibles

### 1. Migration des Villes
- **Fichier** : `src/infrastructure/db/migrations/seed-villes-20260110000001.migration.ts`
- **Contenu** : 73 villes de Côte d'Ivoire (toutes les régions)
- **Méthode** : `INSERT IGNORE` (évite les doublons)

### 2. Migration des Communes (Ancienne - Partielle)
- **Fichier** : `src/infrastructure/db/migrations/seed-communes-20260106000001.migration.ts`
- **Contenu** : ~42 communes principales
- **Statut** : ⚠️ Migration partielle, remplacée par la version complète ci-dessous
- **Dépendance** : Requiert que les villes existent (foreign key)

### 3. Migration des Communes (Complète - Recommandée)
- **Fichier** : `src/infrastructure/db/migrations/seed-communes-complete-20260110000002.migration.ts`
- **Contenu** : 73 communes (une pour chaque ville)
- **Méthode** : `INSERT IGNORE` (évite les doublons avec la migration ancienne)
- **Dépendance** : Requiert que les villes existent (foreign key)

## Exécution des migrations

### Mode Automatique (Recommandé pour Docker)

Les migrations s'exécutent automatiquement au démarrage du conteneur grâce à :
- Variable d'environnement : `DB_MIGRATION_RUN=true` dans `docker-compose.yml`

```bash
# Démarrer le conteneur (les migrations s'exécutent automatiquement)
docker-compose up --build
```

### Mode Manuel

#### En local
```bash
# Compiler et exécuter les migrations
npm run migrate
```

#### Dans Docker
```bash
# Exécuter manuellement les migrations dans un conteneur en cours
docker-compose exec api npm run migrate

# Ou exécuter les seeders séparément
docker-compose exec api npm run seed:villes
docker-compose exec api npm run seed:communes
```

## Vérification

### Vérifier que les migrations ont été exécutées
```sql
-- Voir l'historique des migrations
SELECT * FROM typeorm_migrations ORDER BY timestamp DESC;

-- Compter les villes
SELECT COUNT(*) FROM villes;
-- Résultat attendu : 73 villes

-- Compter les communes
SELECT COUNT(*) FROM communes;
-- Résultat attendu : 73 communes (avec la migration complète)
-- Si vous voyez ~42, seule l'ancienne migration partielle s'est exécutée

-- Voir les villes sans communes
SELECT v.name FROM villes v
LEFT JOIN communes c ON c.ville_id = v.id
WHERE c.id IS NULL;
-- Résultat attendu : 0 villes (toutes doivent avoir au moins une commune)
```

### Logs Docker
```bash
# Voir les logs du conteneur pour vérifier l'exécution des migrations
docker-compose logs -f api
```

## Rollback

Si vous devez annuler les migrations :

```bash
# En local
npm run typeorm migration:revert

# Dans Docker
docker-compose exec api npm run typeorm migration:revert
```

## Structure des données

### Table villes
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom de la ville |

### Table communes
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom de la commune |
| ville_id | UUID | Foreign key vers villes.id |

## Ajouter de nouvelles villes/communes

### Créer une nouvelle migration
```bash
# Générer une nouvelle migration
npm run migration:generate -- src/infrastructure/db/migrations/add-new-cities
```

### Ou modifier manuellement
1. Créer un fichier dans `src/infrastructure/db/migrations/`
2. Suivre le pattern des migrations existantes
3. Utiliser `INSERT IGNORE` pour éviter les doublons
4. Redémarrer le conteneur Docker (les migrations s'exécutent automatiquement)

## Troubleshooting

### Les migrations ne s'exécutent pas
- Vérifier que `DB_MIGRATION_RUN=true` dans docker-compose.yml ou .env
- Vérifier les logs : `docker-compose logs api`
- Vérifier la connexion à la base de données

### Erreur "Ville introuvable"
- Les communes nécessitent que les villes existent d'abord
- S'assurer que la migration des villes s'exécute avant celle des communes
- Vérifier le nom de la ville dans la migration des communes

### Doublons
- Les migrations utilisent `INSERT IGNORE` donc les doublons sont automatiquement ignorés
- Pour forcer une réinsertion, utiliser le rollback puis relancer
