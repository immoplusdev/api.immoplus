# 🚀 Guide Rapide - Migrations Villes & Communes

## 📦 Ce qui a été ajouté

✅ Migration automatique des **73 villes** de Côte d'Ivoire
✅ Migration automatique des **73 communes** (une par ville)
✅ Exécution automatique au démarrage Docker
✅ Script de vérification pour valider les données

## 🎯 Utilisation Rapide

### Option 1 : Docker (Recommandée)

```bash
# 1. Démarrer le conteneur (les migrations s'exécutent automatiquement)
docker-compose up --build

# 2. Vérifier que tout est OK
docker-compose exec api npm run verify:migrations
```

### Option 2 : En local

```bash
# 1. Exécuter les migrations
npm run migrate

# 2. Vérifier
npm run verify:migrations
```

## ✅ Vérification Manuelle

```bash
# En local
npm run verify:migrations

# Dans Docker
docker-compose exec api npm run verify:migrations
```

**Résultat attendu :**
```
✅ 73 villes trouvées
✅ 73 communes trouvées
✅ Toutes les villes ont au moins une commune
✅ 10 communes pour Abidjan
🎉 Vos migrations sont correctement exécutées.
```

## 📊 Données Incluses

### Villes (73 au total)
- **Abidjan** : 10 communes (Abobo, Adjamé, Attécoubé, Cocody, Koumassi, Marcory, Plateau, Port-Bouët, Treichville, Yopougon)
- **Autres grandes villes** : Bouaké, Yamoussoukro, Daloa, Korhogo, San-Pédro, etc.
- **Toutes les régions** : 9 régions couvertes

### Communes (73 au total)
- Abidjan a 10 communes détaillées
- Chaque autre ville a une commune principale (même nom que la ville)

## 🔧 Commandes Utiles

```bash
# Vérifier les migrations
npm run verify:migrations

# Exécuter manuellement les migrations
npm run migrate

# Exécuter uniquement les villes (si besoin)
npm run seed:villes

# Exécuter uniquement les communes (si besoin)
npm run seed:communes

# Voir les migrations exécutées (SQL direct)
SELECT * FROM typeorm_migrations ORDER BY timestamp DESC;

# Compter les villes et communes
SELECT COUNT(*) FROM villes;    -- Attendu: 73
SELECT COUNT(*) FROM communes;  -- Attendu: 73
```

## 🐛 Dépannage

### Problème : "Aucune migration exécutée"

**Solution 1 - Docker :**
```bash
# Vérifier que DB_MIGRATION_RUN=true dans docker-compose.yml
docker-compose down
docker-compose up --build
```

**Solution 2 - Local :**
```bash
npm run migrate
```

### Problème : "Moins de 73 villes/communes"

**Solution :**
```bash
# En local
npm run migrate

# Dans Docker
docker-compose exec api npm run migrate
```

### Problème : "Ville introuvable pour la commune X"

**Cause :** La migration des communes s'exécute avant celle des villes

**Solution :**
- TypeORM exécute les migrations dans l'ordre chronologique
- La migration des villes (20260110000001) s'exécute avant celle des communes (20260110000002)
- Si le problème persiste, vérifiez que la migration des villes a bien été exécutée :
  ```bash
  npm run verify:migrations
  ```

## 📚 Documentation Complète

- **Guide complet** : [MIGRATIONS.md](./MIGRATIONS.md)
- **Changelog** : [CHANGELOG-MIGRATIONS.md](./CHANGELOG-MIGRATIONS.md)
- **Configuration Docker** : [docker-compose.yml](./docker-compose.yml)

## 🎓 Comprendre le Système

### Fichiers de Migration

```
src/infrastructure/db/migrations/
├── seed-villes-20260110000001.migration.ts          ← 73 villes
└── seed-communes-complete-20260110000002.migration.ts ← 73 communes
```

### Ordre d'Exécution

1. **Au démarrage Docker** (si `DB_MIGRATION_RUN=true`):
   - TypeORM vérifie les migrations non exécutées
   - Exécute d'abord `seed-villes-20260110000001`
   - Puis exécute `seed-communes-complete-20260110000002`
   - Enregistre dans la table `typeorm_migrations`

2. **Idempotence** :
   - Utilise `INSERT IGNORE` pour éviter les doublons
   - Peut être exécuté plusieurs fois sans problème

### Variables d'Environnement

```env
# Dans .env ou docker-compose.yml
DB_MIGRATION_RUN=true   # Active l'exécution automatique
```

## 💡 Cas d'Usage

### Déploiement en Production

```bash
# Les migrations s'exécutent automatiquement au démarrage
docker-compose -f docker-compose.prod.yml up -d

# Vérifier
docker-compose -f docker-compose.prod.yml exec api npm run verify:migrations
```

### Développement Local

```bash
# Option 1: Avec Docker
docker-compose up

# Option 2: Sans Docker
npm run migrate
npm run start:dev
```

### Tests / Staging

```bash
# Réinitialiser la base (attention: supprime toutes les données!)
npm run typeorm migration:revert

# Ré-exécuter les migrations
npm run migrate
```

## 🎉 C'est Tout !

Vos villes et communes sont maintenant automatiquement gérées via les migrations TypeORM.

**Besoin d'aide ?** Consultez [MIGRATIONS.md](./MIGRATIONS.md) pour plus de détails.
