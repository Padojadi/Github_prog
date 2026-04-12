# API gRPC

L'API gRPC de Protosen DPCT fonctionne en parallèle de l'API REST Express. Elle permet des communications performantes entre microservices avec des contrats fortement typés.

## Architecture

L'application exécute **deux serveurs simultanément**:
- **API REST**: Express (port configuré dans `.env`)
- **API gRPC**: Port 50051 (ou `GRPC_PORT` dans `.env`)

Les deux serveurs partagent:
- La même base de données PostgreSQL
- Les mêmes modèles Sequelize
- Les mêmes services métier
- Les mêmes utilitaires

## Structure du projet

```
grpc/
├── generated/                       # Code TypeScript auto-généré (NE PAS MODIFIER)
│   ├── user.ts
│   ├── organisme.ts
│   └── google/protobuf/empty.ts
├── server.ts                        # Point d'entrée du serveur gRPC
└── auth.interceptor.ts              # Intercepteur d'authentification par API key

src/modules/
├── user/
│   ├── controllers/
│   │   ├── user.http.controller.ts  # Controller REST
│   │   └── user.grpc.controller.ts  # Controller gRPC
│   ├── services/user.service.ts     # Logique métier (partagée REST/gRPC)
│   └── protos/user.proto            # Définition Protocol Buffer
└── institution/
    ├── controllers/
    │   ├── institution.http.controller.ts
    │   └── institution.grpc.controller.ts
    ├── services/institution.service.ts
    └── protos/organisme.proto

scripts/
└── generate-grpc.sh                 # Script de génération TypeScript depuis proto files
```

## Services disponibles

### UserService

**GetUserByToken**: Authentifie et récupère un utilisateur via son token JWT

```protobuf
rpc GetUserByToken (TokenRequest) returns (User)
```

**GetUsersByIds**: Récupère plusieurs utilisateurs par leurs IDs

```protobuf
rpc GetUsersByIds (UserIdsRequest) returns (UserList)
```

**GetUser**: Récupère un utilisateur par ID ou email

```protobuf
rpc GetUser (GetUserRequest) returns (User)
```

### OrganismeService

**GetAllOrganismes**: Récupère tous les organismes

```protobuf
rpc GetAllOrganismes (Empty) returns (OrganismeList)
```

**GetOrganismeById**: Récupère un organisme par son ID

```protobuf
rpc GetOrganismeById (OrganismeIdRequest) returns (Organisme)
```

**GetOrganismesByIds**: Récupère plusieurs organismes par leurs IDs

```protobuf
rpc GetOrganismesByIds (OrganismeIdsRequest) returns (OrganismeList)
```

## Démarrage

### Développement

```bash
# Démarrer uniquement le serveur gRPC
npm run dev-grpc

# Démarrer REST + gRPC en parallèle
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Configuration

Variables d'environnement requises dans `.env`:

```env
# Port du serveur gRPC
GRPC_PORT=50051

# Clé API pour authentifier les requêtes gRPC
# Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
GRPC_API_KEY=your_secret_key_here
```

## Sécurité

### Authentification par clé API

Toutes les requêtes gRPC nécessitent une clé API dans les métadonnées:

```typescript
const metadata = new grpc.Metadata();
metadata.add('api-key', process.env.GRPC_API_KEY);

client.getUser(request, metadata, callback);
```

Le middleware `auth.interceptor.ts` vérifie automatiquement cette clé sur tous les endpoints.

### Validation JWT

Le service `UserService` valide également les tokens JWT:
- Vérifie la signature du token
- Vérifie l'expiration
- Retourne une erreur `UNAUTHENTICATED` si invalide

## Tests

### Avec grpcurl

```bash
# Lister les services disponibles
grpcurl -plaintext localhost:50051 list

# Lister les méthodes d'un service
grpcurl -plaintext localhost:50051 list users.UserService

# Appeler une méthode
grpcurl -plaintext \
  -H 'api-key: votre_cle_api' \
  -d '{"id": "123"}' \
  localhost:50051 \
  users.UserService/GetUser
```

### Avec Postman

1. Créer une nouvelle requête gRPC
2. URL: `localhost:50051`
3. Importer les fichiers `.proto` depuis `src/modules/*/protos/`
4. Ajouter les métadonnées: `api-key: votre_cle_api`
5. Sélectionner le service et la méthode
6. Envoyer la requête

### Avec Node.js Client

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('src/modules/user/protos/user.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.users.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
metadata.add('api-key', process.env.GRPC_API_KEY);

client.getUser({ id: '123' }, metadata, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log(response);
  }
});
```

## Dépannage

### Le serveur ne démarre pas

1. Vérifiez que le port 50051 n'est pas déjà utilisé:
   ```bash
   lsof -i :50051
   ```

2. Vérifiez la configuration de la base de données

3. Vérifiez que `GRPC_API_KEY` est défini dans `.env`

### Erreur "Cannot find module '../generated/...'"

Régénérez le code TypeScript:
```bash
npm run generate:grpc
```

### Erreur d'authentification

Vérifiez que:
1. La clé API est correcte dans les métadonnées
2. La variable `GRPC_API_KEY` est définie dans `.env`
3. Le header est bien `api-key` (pas `x-api-key`)

## Ressources

- [gRPC Documentation officielle](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://protobuf.dev/)
- [ts-proto (générateur TypeScript)](https://github.com/stephenh/ts-proto)
- [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)

## Prochaines étapes

- [Installation et configuration](/guide/getting-started)
- [Architecture du projet](/architecture/overview)
- [API REST](/api/rest)
