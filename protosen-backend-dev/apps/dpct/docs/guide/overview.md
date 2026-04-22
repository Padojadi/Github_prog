# Vue d'ensemble

Protosen DPCT est une API complète pour la gestion des cartes diplomatiques au Sénégal. Le système expose deux APIs: REST (Express) et gRPC pour différents cas d'usage.

## Fonctionnalités principales

### Gestion des cartes diplomatiques

Le système gère plusieurs types de cartes diplomatiques:

- **Owner (Titulaire)**: Ambassadeurs et hauts fonctionnaires
- **Spouse (Conjoint)**: Conjoints des titulaires
- **Child (Enfant)**: Enfants des titulaires
- **Other Dependant**: Autres personnes à charge
- **Domestic & Relative**: Personnel de service et famille
- **Other Staff**: Autres personnels diplomatiques

Chaque type supporte:
- Nouvelle demande
- Renouvellement
- Duplicata

### Gestion des utilisateurs et institutions

- Authentification JWT avec refresh tokens
- Gestion des rôles (user, admin, super_admin)
- CRUD institutions/organismes diplomatiques
- Groupes d'accès et permissions

### Stockage et fichiers

- Upload de documents (passeport, lettre de créance, photos)
- Stockage sécurisé sur AWS S3
- URLs pré-signées pour accès temporaire

### Statistiques

- Statistiques par type de carte
- Statistiques de renouvellement
- Statistiques de duplicata
- Filtrage par période et institution

## Architecture technique

### Stack technologique

- **Runtime**: Node.js avec TypeScript
- **API REST**: Express avec Swagger/OpenAPI
- **API gRPC**: @grpc/grpc-js avec Protocol Buffers
- **Base de données**: PostgreSQL avec Sequelize ORM
- **Authentification**: JWT (RS256) avec argon2 pour les mots de passe
- **Validation**: Zod pour la validation des données
- **Tests**: Jest avec Supertest
- **Documentation**: VitePress

### Principes de conception

- **Domain-Driven Design (DDD)**: Modules métier découplés
- **Separation of Concerns**: Controllers, Services, Repositories
- **Shared Business Logic**: Services partagés entre REST et gRPC
- **Type Safety**: TypeScript avec validation Zod
- **API First**: Documentation auto-générée avec Swagger

## Cas d'usage

### API REST

L'API REST est idéale pour:
- Applications web frontales
- Applications mobiles
- Intégrations webhook
- Accès direct depuis le navigateur

### API gRPC

L'API gRPC est idéale pour:
- Communication inter-microservices
- Applications nécessitant des performances élevées
- Clients en Go, Java, Python, etc.
- Streaming bidirectionnel (futur)

## Performance

- Connexions persistantes avec gRPC
- Pagination sur tous les endpoints de liste
- Indexation base de données optimisée
- Cache AWS S3 avec URLs pré-signées
- Build optimisé pour production

## Sécurité

- Authentification JWT RS256
- Hachage des mots de passe avec argon2
- API key pour gRPC
- Validation stricte des entrées avec Zod
- Headers de sécurité (CORS, CSP)
- Protection contre les injections SQL (Sequelize ORM)

## Prochaines étapes

- [Installation](/guide/getting-started)
- [Configuration](/guide/configuration)
- [Architecture](/architecture/overview)
- [API REST](/api/rest)
- [API gRPC](/api/grpc)
