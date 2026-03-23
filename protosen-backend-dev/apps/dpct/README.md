# Protosen DPCT API

API backend pour le système DPCT (Diplomatic Card Management) - Gestion des cartes diplomatiques.

## Prérequis

- Node.js 18.x
- PostgreSQL 14+
- Docker (optionnel)

## Installation

```bash
# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
```

## Développement

```bash
# Lancer Express + gRPC en parallèle
npm run dev

# Lancer Express seulement
npm run dev-app

# Lancer gRPC seulement
npm run dev-grpc
```

## Build & Production

```bash
# Build
npm run build

# Lancer en production
npm start
```

## Tests

```bash
# Tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests d'intégration
npm run test:integration

# Tests unitaires
npm run test:unit
```

## Linting & Formatting

```bash
# Linter
npm run lint
npm run lint:fix

# Formatter
npm run format
```

## API Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **gRPC Reflection**: port 50051

## Structure du projet

```
src/
├── config/          # Configuration (env, swagger, database)
├── database/        # Modèles Sequelize et migrations
├── modules/         # Modules métier
│   ├── auth/        # Authentification
│   ├── cards/       # Gestion des cartes (owner, child, spouse, etc.)
│   ├── organisme/   # Organismes diplomatiques
│   └── users/       # Gestion des utilisateurs
├── shared/          # Utilitaires partagés
│   ├── libs/        # Librairies (JWT, etc.)
│   ├── middlewares/ # Middlewares Express
│   ├── services/    # Services partagés
│   └── utils/       # Fonctions utilitaires
└── jobs/            # Tâches planifiées (cron)

grpc/                # Serveur gRPC
├── generated/       # Code généré depuis les .proto
├── handlers/        # Handlers gRPC
└── protos/          # Fichiers .proto

tests/               # Tests
├── integration/     # Tests d'intégration
└── unit/            # Tests unitaires
```

## Docker

```bash
# Build l'image
docker build -t protosen-dpct-api .

# Lancer le container
docker run -p 3000:3000 -p 50051:50051 protosen-dpct-api
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `development` / `production` |
| `PORT` | Port Express | `3000` |
| `GRPC_PORT` | Port gRPC | `50051` |
| `DATABASE_URL` | URL PostgreSQL | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Clé secrète JWT | `your-secret-key` |

## License

MIT
