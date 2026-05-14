# Configuration

Ce guide détaille toutes les variables d'environnement nécessaires au fonctionnement de l'application.

## Fichier .env

Copiez `env.example` vers `.env` et configurez les variables selon votre environnement.

```bash
cp env.example .env
```

## Variables d'environnement

### Application

```env
# Environment mode (production, development, test)
NODE_ENV=development
ENV=development

# Application HTTP server port
PORT=5001
```

### Base de données PostgreSQL

```env
# PostgreSQL database name
POSTGRES_DB=protosen_dpct

# PostgreSQL database user
POSTGRES_USER=postgres

# PostgreSQL database password
POSTGRES_PASSWORD=your_password_here

# PostgreSQL host (localhost for local dev, service name for Docker)
POSTGRES_HOST=localhost

# PostgreSQL port (default: 5432)
POSTGRES_PORT=5432
```

### Authentification JWT

```env
# Access token expiration time (e.g., 15m, 1h, 2d)
JWT_EXPIRES_IN=1h

# Refresh token expiration time (e.g., 7d, 30d, 100h)
JWT_REFRESH_EXPIRES_IN=100h
```

#### Génération des clés RSA

Pour générer les paires de clés RSA pour JWT:

```bash
# Générer la clé privée
openssl genrsa -out private.pem 2048

# Extraire la clé publique
openssl rsa -in private.pem -pubout -out public.pem

# Afficher la clé privée (à copier dans .env)
cat private.pem

# Afficher la clé publique (à copier dans .env)
cat public.pem
```

Configurez ensuite dans `.env`:

```env
ACCESS_TOKEN_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----"

ACCESS_TOKEN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"

REFRESH_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----"

REFRESH_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
```

### AWS S3 (Stockage de fichiers)

```env
# AWS S3 Access Key ID
ACCESS_KEY=your_aws_access_key_id

# AWS S3 Secret Access Key
SECRET_KEY=your_aws_secret_access_key

# S3 bucket name for file storage
BUCKET_NAME=your-bucket-name

# AWS region where the bucket is located (e.g., us-east-1, eu-west-1)
BUCKET_REGION=us-east-1
```

### Email (SMTP)

```env
# SMTP service provider (e.g., gmail, outlook, or custom)
MAIL_SERVICE=custom

# SMTP server host
MAIL_HOST=smtp.example.com

# SMTP server port (25, 465 for SSL, 587 for TLS)
MAIL_PORT=25

# SMTP authentication username
MAIL_USER=noreply@example.com

# SMTP authentication password
MAIL_PASS=your_email_password
```

### gRPC

```env
# gRPC server port
GRPC_PORT=50051

# API key for authenticating gRPC requests
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
GRPC_API_KEY=your_grpc_api_key_here
```

#### Génération de la clé API gRPC

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Configuration par environnement

### Développement

```env
NODE_ENV=development
ENV=development
PORT=5001
POSTGRES_HOST=localhost
```

### Test

```env
NODE_ENV=test
ENV=test
PORT=5002
POSTGRES_DB=protosen_dpct_test
```

### Production

```env
NODE_ENV=production
ENV=production
PORT=5001
# Utilisez des secrets sécurisés en production
```

## Validation

Au démarrage, l'application vérifie que toutes les variables requises sont définies. Si une variable manque, l'application affichera un message d'erreur explicite.

## Sécurité

::: danger Sécurité
- Ne commitez **JAMAIS** le fichier `.env` dans Git
- Utilisez des clés différentes pour chaque environnement
- Changez régulièrement les clés API et secrets
- Utilisez des gestionnaires de secrets en production (AWS Secrets Manager, HashiCorp Vault, etc.)
:::

## Prochaines étapes

- [Architecture du projet](/architecture/overview)
- [Développement](/guide/getting-started)
