# Documentation API Protosen DPCT

## Accès à la documentation

### Documentation interactive (Swagger UI)

Une fois le serveur démarré, accédez à la documentation interactive à l'adresse :

```
http://localhost:5000/api-docs
```

Cette interface vous permet de :
- 📖 Explorer tous les endpoints disponibles
- 🧪 Tester les requêtes directement depuis le navigateur
- 📝 Voir les schémas de données et validations
- 🔐 Tester l'authentification avec vos tokens JWT

### Documentation JSON brute

Pour obtenir la spécification OpenAPI au format JSON :

```
http://localhost:5000/api-docs/json
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Obtenir un token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Réponse:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Utiliser le token

Incluez le token dans l'en-tête Authorization de toutes les requêtes protégées :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rafraîchir le token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Rôles et permissions

### Rôles disponibles

- **user**: Utilisateur standard
- **admin**: Administrateur d'une institution
- **super_admin**: Super administrateur (accès complet)

### Permissions par rôle

| Endpoint | user | admin | super_admin |
|----------|------|-------|-------------|
| GET /api/user | ✅ | ✅ | ✅ |
| GET /api/user/all | ❌ | ❌ | ✅ |
| POST /api/institution | ❌ | ❌ | ✅ |
| GET /api/stats/card | ❌ | ✅ | ✅ |
| POST /api/cards/* | ✅ | ✅ | ✅ |

## Modules disponibles

### 1. Authentication (`/api/auth`)
- Connexion/déconnexion
- Création de compte
- Rafraîchissement des tokens
- Confirmation d'email

### 2. Users (`/api/user`)
- Gestion du profil utilisateur
- Réinitialisation de mot de passe
- Administration des utilisateurs (super admin)

### 3. Institutions (`/api/institution`)
- CRUD institutions (super admin uniquement)
- Import depuis seeds

### 4. Cards (`/api/cards`)
Gestion des cartes diplomatiques pour :
- **Owner** (`/api/cards/owner`) - Titulaires
- **Spouse** (`/api/cards/spouse`) - Conjoints
- **Child** (`/api/cards/child`) - Enfants
- **Other Dependant** (`/api/cards/other-dependant`) - Autres dépendants
- **Domestic & Relative** (`/api/cards/domestic-and-relative`) - Personnel de service
- **Other Staff** (`/api/cards/other-staff`) - Autres personnels

Chaque type de carte supporte :
- ✨ Nouvelle demande
- 🔄 Renouvellement
- 📋 Duplicata

### 5. Statistics (`/api/stats`)
- Statistiques par type de carte
- Statistiques de renouvellement
- Statistiques de duplicata

### 6. Card Types (`/api/card-types`)
- Gestion des types de cartes
- CRUD (super admin uniquement)

### 7. Plaques (`/api/plaque`)
- Gestion des plaques d'immatriculation
- CRUD (super admin uniquement)

### 8. Access Groups (`/api/accessgroup`)
- Gestion des groupes d'accès
- Attribution de permissions
- CRUD (super admin uniquement)

## Codes de statut HTTP

### Succès (2xx)
- `200 OK` - Requête réussie
- `201 Created` - Ressource créée
- `204 No Content` - Suppression réussie

### Erreurs Client (4xx)
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource non trouvée
- `422 Unprocessable Entity` - Erreur de validation

### Erreurs Serveur (5xx)
- `500 Internal Server Error` - Erreur serveur

## Validation des données

L'API utilise [Zod](https://zod.dev/) pour la validation des données.

### Exemple de réponse d'erreur de validation

```json
{
  "errors": [
    {
      "path": ["body", "email"],
      "message": "Adresse email invalide"
    },
    {
      "path": ["body", "password"],
      "message": "Le mot de passe doit contenir au moins 8 caractères"
    }
  ]
}
```

## Pagination

Les endpoints de liste supportent la pagination :

```http
GET /api/user/all?page=1&limit=10
```

**Paramètres:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 10, max: 100)
- `sort`: Tri (ex: `createdAt:desc`)
- `search`: Recherche textuelle

**Réponse:**
```json
{
  "count": 42,
  "rows": [...]
}
```

## Upload de fichiers

Pour les endpoints nécessitant des fichiers :

```http
PUT /api/cards/owner/files
Content-Type: multipart/form-data
Authorization: Bearer <token>

------WebKitFormBoundary
Content-Disposition: form-data; name="passport"; filename="passport.pdf"
Content-Type: application/pdf

[binary data]
------WebKitFormBoundary
```

### Champs requis
- `passport`: Passeport (PDF, max 5MB)
- `lc`: Lettre de créance (PDF, max 5MB)
- `photo`: Photo (JPG/PNG, max 2MB) - optionnel
- `others`: Autres documents (PDF, max 5MB chacun) - optionnel

## Exemples de requêtes

### Créer une demande de carte (Owner)

```bash
curl -X POST http://localhost:5000/api/cards/owner \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@embassy.com",
    "phone": "+221 77 123 45 67",
    "gender": "Masculin",
    "dateOfBirth": "1980-01-01",
    "citizenship": "États-Unis",
    "jobFunction": "Ambassadeur"
  }'
```

### Obtenir les statistiques (Admin)

```bash
curl -X GET http://localhost:5000/api/stats/card \
  -H "Authorization: Bearer <token>"
```

## Rate Limiting

L'API applique des limites de taux pour éviter les abus :

- **Authentification**: 5 requêtes / minute / IP
- **Endpoints standards**: 100 requêtes / minute / utilisateur
- **Upload de fichiers**: 10 requêtes / minute / utilisateur

## Support

Pour toute question ou problème, contactez l'équipe de développement.
