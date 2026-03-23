# Modules DDD - Documentation

## Structure d'un module

Chaque module suit l'architecture Domain-Driven Design (DDD) avec la structure suivante :

```
src/modules/{module-name}/
├── controllers/        # Contrôleurs (gestion des requêtes HTTP)
├── services/          # Logique métier
├── repositories/      # Accès aux données (optionnel)
├── dtos/             # Data Transfer Objects (validation Zod)
├── types/            # Types TypeScript spécifiques au module
├── docs/             # Documentation Swagger/OpenAPI
├── {module}.routes.ts # Routes du module
└── index.ts          # Point d'entrée du module
```

## Types

### Types partagés
Les types communs à tous les modules sont dans `src/shared/types/`:
- `StatusEnum`, `StrictStatusEnum`
- `Permission`
- `IQueryOptions`, `IResults`
- `CustomFile`
- `EGenderEnum`, `EMatrimosnialStatus`

Import: `import { StatusEnum } from '@shared/types';`

### Types spécifiques
Chaque module a ses propres types dans `{module}/types/`:
- **user**: `RoleEnum`, `IRegisterUser`, `IUpdateUser`, etc.
- **cards**: `EDocumentState`, `EDemandType`, interfaces de cartes
- **institution**: `IInstitution`, `IInstitutionQueryOptions`

Import: `import { RoleEnum } from '../types';` (relatif depuis le module)

## Documentation Swagger

### Structure
Chaque module a un fichier `docs/swagger.yaml` qui contient:
- Les définitions des routes
- Les schémas de données
- Les exemples de requêtes/réponses
- Les règles d'authentification

### Format OpenAPI 3.0

```yaml
tags:
  - name: Module Name
    description: Description du module

paths:
  /api/module/route:
    get:
      tags:
        - Module Name
      summary: Description courte
      description: Description détaillée
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Succès

components:
  schemas:
    SchemaName:
      type: object
      properties:
        field:
          type: string
```

### Bonnes pratiques

1. **Tags**: Utiliser le nom du module pour grouper les routes
2. **Security**: Spécifier `BearerAuth` pour les routes protégées
3. **Schémas**: Définir tous les modèles de données dans `components/schemas`
4. **Descriptions**: Être précis sur les permissions requises
5. **Exemples**: Inclure des exemples de requêtes/réponses

### Génération de la documentation

Pour générer la documentation Swagger complète, tous les fichiers `swagger.yaml` doivent être combinés dans un fichier principal (généralement via un outil comme `swagger-jsdoc` ou manuellement).

## Modules disponibles

1. **auth** - Authentification et gestion des tokens
2. **user** - Gestion des utilisateurs
3. **cards** - Cartes diplomatiques (6 sous-modules)
4. **institution** - Gestion des institutions
5. **statistics** - Statistiques des cartes
6. **cardType** - Types de cartes
7. **plaque** - Gestion des plaques d'immatriculation
8. **accessgroup** - Groupes d'accès et permissions

## Routes principales

| Module | Route | Description |
|--------|-------|-------------|
| auth | `/api/auth` | Authentification |
| user | `/api/user` | Gestion utilisateurs |
| cards | `/api/cards` | Cartes diplomatiques |
| institution | `/api/institution` | Institutions |
| stats | `/api/stats` | Statistiques |
| card-types | `/api/card-types` | Types de cartes |
| plaque | `/api/plaque` | Plaques |
| accessgroup | `/api/accessgroup` | Groupes d'accès |

## Ajout d'un nouveau module

1. Créer la structure du module dans `src/modules/{nom}/`
2. Créer les types spécifiques dans `{nom}/types/`
3. Créer la documentation Swagger dans `{nom}/docs/swagger.yaml`
4. Créer les DTOs, controllers, services
5. Créer le fichier de routes `{nom}.routes.ts`
6. Créer l'index `index.ts` qui exporte le router
7. Ajouter le module dans `src/routes/index.ts`

