---
layout: home

hero:
  name: "Protosen DPCT"
  text: "Gestion des Cartes Diplomatiques"
  tagline: API REST & gRPC pour la gestion des cartes diplomatiques au Sénégal
  actions:
    - theme: brand
      text: Commencer
      link: /guide/getting-started
    - theme: alt
      text: API REST
      link: /api/rest
    - theme: alt
      text: API gRPC
      link: /api/grpc

features:
  - icon: 🚀
    title: Architecture DDD
    details: Domain-Driven Design avec modules découplés pour une meilleure maintenabilité
  - icon: 🔐
    title: Sécurité JWT
    details: Authentification robuste avec tokens JWT et refresh tokens
  - icon: ⚡
    title: Dual API
    details: API REST (Express) et gRPC pour différents cas d'usage
  - icon: 📊
    title: PostgreSQL + Sequelize
    details: Base de données relationnelle avec ORM TypeScript-friendly
  - icon: 🧪
    title: Tests complets
    details: Tests unitaires et d'intégration avec Jest
  - icon: 📦
    title: AWS S3
    details: Stockage de fichiers sécurisé avec pré-signed URLs
---

## Démarrage rapide

```bash
# Installation
npm install

# Configuration
cp env.example .env
# Éditer .env avec vos configurations

# Générer les types gRPC
npm run generate:grpc

# Développement (REST + gRPC)
npm run dev

# Build pour production
npm run build

# Production
npm start
```

## Technologies

- **Backend**: Node.js + TypeScript + Express
- **gRPC**: @grpc/grpc-js + ts-proto
- **Database**: PostgreSQL + Sequelize ORM
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken + argon2)
- **Storage**: AWS S3
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI + VitePress
- **Tests**: Jest + Supertest

## Architecture

Le projet suit une architecture Domain-Driven Design (DDD) avec:
- Modules métier indépendants
- Séparation des préoccupations (HTTP, gRPC, Services, Repositories)
- Services partagés entre REST et gRPC
- Controllers distincts pour chaque protocole

```
src/modules/
├── user/
│   ├── controllers/
│   │   ├── user.http.controller.ts  # REST
│   │   └── user.grpc.controller.ts  # gRPC
│   ├── services/user.service.ts     # Logique métier
│   ├── repositories/user.repository.ts
│   └── protos/user.proto
```
