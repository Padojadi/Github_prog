# Installation et Démarrage

## Prérequis

- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm ou yarn

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/protosen/protosen-dpct-api.git
cd protosen-dpct-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copiez le fichier d'exemple et configurez les variables:

```bash
cp env.example .env
```

Éditez `.env` avec vos configurations. Voir [Configuration](/guide/configuration) pour les détails.

### 4. Configurer la base de données

Créez une base de données PostgreSQL:

```bash
createdb protosen_dpct
```

Exécutez les migrations:

```bash
npx sequelize-cli db:migrate
```

### 5. Générer les types gRPC

```bash
npm run generate:grpc
```

Cette commande génère les types TypeScript depuis les fichiers `.proto`.

## Développement

### Démarrer les serveurs de développement

```bash
# REST + gRPC ensemble
npm run dev

# Ou séparément:
npm run dev-app   # Seulement REST (port 5001)
npm run dev-grpc  # Seulement gRPC (port 50051)
```

### Accéder aux services

- **API REST**: http://127.0.0.1:5001
- **Swagger UI**: http://127.0.0.1:5001/api-docs
- **gRPC Server**: localhost:50051

## Tests

```bash
# Tous les tests
npm test

# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests avec coverage
npm run test:coverage

# Mode watch
npm run test:watch
```

## Build pour production

```bash
npm run build
```

Cette commande:
1. Compile le TypeScript vers JavaScript
2. Copie les fichiers `.proto` dans le dossier `build/`

## Production

```bash
npm start
```

Lance les serveurs REST et gRPC en mode production.

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer REST + gRPC en développement |
| `npm run dev-app` | Démarrer seulement REST |
| `npm run dev-grpc` | Démarrer seulement gRPC |
| `npm run build` | Build pour production |
| `npm start` | Démarrer en production |
| `npm run generate:grpc` | Générer types depuis proto files |
| `npm test` | Lancer tous les tests |
| `npm run format` | Formater le code avec Prettier |

## Prochaines étapes

- [Configuration détaillée](/guide/configuration)
- [Architecture du projet](/architecture/overview)
- [Documentation API REST](/api/rest)
- [Documentation API gRPC](/api/grpc)
