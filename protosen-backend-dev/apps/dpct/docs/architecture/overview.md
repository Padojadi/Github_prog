# Architecture du Projet

## Vue d'ensemble

Protosen DPCT suit une architecture **Domain-Driven Design (DDD)** avec une séparation claire des préoccupations. Le projet expose deux APIs distinctes: REST (Express) et gRPC.

## Architecture en couches

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │   HTTP Controllers   │  │    gRPC Controllers      │ │
│  │  (Express Routes)    │  │  (Proto Implementations) │ │
│  └──────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌─────────────────────────────────────────────────────┐│
│  │                Services (Business Logic)            ││
│  │         Partagés entre REST et gRPC                 ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Domain Layer                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │        Repositories (Data Access Layer)             ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                Infrastructure Layer                      │
│  ┌──────────────┐  ┌──────────┐  ┌────────────────────┐│
│  │  PostgreSQL  │  │  AWS S3  │  │  SMTP (Nodemailer) ││
│  └──────────────┘  └──────────┘  └────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Structure des modules

Chaque module suit une structure cohérente:

```
src/modules/{module}/
├── controllers/
│   ├── {module}.http.controller.ts    # REST endpoints
│   └── {module}.grpc.controller.ts    # gRPC endpoints
├── services/
│   └── {module}.service.ts            # Business logic
├── repositories/
│   └── {module}.repository.ts         # Data access
├── dtos/
│   └── {module}.dto.ts                # Data validation schemas (Zod)
├── types/
│   └── {module}.types.ts              # TypeScript interfaces
└── protos/
    └── {module}.proto                 # Protocol Buffer definitions
```

## Principes DDD appliqués

### 1. Bounded Contexts

Chaque module représente un **bounded context** avec:
- Ses propres modèles de domaine
- Ses propres règles métier
- Ses interfaces clairement définies

### 2. Séparation des préoccupations

- **Controllers**: Gestion des requêtes/réponses (HTTP ou gRPC)
- **Services**: Logique métier pure, indépendante du protocole
- **Repositories**: Accès aux données, abstraction de la persistence
- **DTOs**: Validation et transformation des données

### 3. Dependency Injection

Les services et repositories sont injectés dans les controllers:

```typescript
export class UserHttpController {
  private userService = new UsersService();

  async getUser(req: Request, res: Response) {
    const user = await this.userService.getUserById(req.params.id);
    res.json(user);
  }
}
```

## Flux de données

### Requête REST

```
Client → Express Router → HTTP Controller → Service → Repository → Database
                                                    ↓
Client ← Response ← HTTP Controller ← Service Result
```

### Requête gRPC

```
Client → gRPC Server → Auth Interceptor → gRPC Controller → Service → Repository → Database
                                                                    ↓
Client ← gRPC Response ← gRPC Controller ← Service Result
```

## Shared Kernel

Certains composants sont partagés entre tous les modules:

```
src/shared/
├── middleware/        # Express middleware (auth, validation, error)
├── utils/             # Utilitaires (auth, mailer, logger)
├── services/          # Services partagés (FileService)
└── types/             # Types communs
```

## Avantages de cette architecture

### Maintenabilité
- Code organisé en modules indépendants
- Facilite les modifications localisées
- Réduit les couplages

### Testabilité
- Services métier isolés
- Mocks faciles à créer
- Tests unitaires et d'intégration séparés

### Scalabilité
- Modules indépendants peuvent être déployés séparément
- gRPC permet la communication inter-services performante
- Cache et optimisations par module

### Réutilisabilité
- Services partagés entre REST et gRPC
- Logique métier centralisée
- Pas de duplication de code

## Technologies clés

| Couche | Technologies |
|--------|--------------|
| Presentation | Express, @grpc/grpc-js |
| Application | TypeScript, Zod validation |
| Domain | Sequelize ORM |
| Infrastructure | PostgreSQL, AWS S3, Nodemailer |
| Build | TypeScript Compiler, ts-proto |

## Prochaines étapes

- [Installation](/guide/getting-started)
- [Configuration](/guide/configuration)
- [API REST](/api/rest)
- [API gRPC](/api/grpc)
