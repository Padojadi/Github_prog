# Configuration CI/CD — Protosen Backend

## Workflows

| Workflow | Fichier | Trigger | Environment | Déploie |
|----------|---------|---------|-------------|---------|
| DPCT Dev | `dpct-dev.yml` | Push sur `dev` (si `apps/dpct/` ou `packages/shared/` modifié) | `development` | Stack dev dpct |
| DPCT Prod | `dpct-prod.yml` | Push sur `main` (si `apps/dpct/` ou `packages/shared/` modifié) | `production` | Stack prod dpct |
| Conferences Dev | `conferences-dev.yml` | Push sur `dev` (si `apps/conferences/` ou `packages/shared/` modifié) | `development` | Stack dev conferences |
| Conferences Prod | `conferences-prod.yml` | Push sur `main` (si `apps/conferences/` ou `packages/shared/` modifié) | `production` | Stack prod conferences |

> Les workflows ne se déclenchent que si les fichiers concernés sont modifiés (path filters).
> Un changement dans `packages/shared/` déclenche le build des **deux** apps.

## Secrets & Variables à configurer

### Repository secrets (partagés, Settings → Secrets → Actions)

Secrets communs à tous les workflows, configurés une seule fois au niveau du repo.

| Secret | Description | Exemple |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS IAM | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS IAM | `wJal...` |
| `ECR_REGISTRY` | URL du registre ECR (sans le tag) | `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `EC2_IP` | Adresse IP de l'instance EC2 | `54.xx.xx.xx` |
| `EC2_USER` | Utilisateur SSH sur l'EC2 | `ec2-user` |
| `AWS_SSH_KEY` | Clé privée SSH pour accéder à l'EC2 | Contenu du fichier `.pem` |

### Environment secrets (par environnement, Settings → Environments)

Chaque environnement (`development`, `production`) contient les mêmes noms de secrets mais avec des valeurs différentes.

| Secret | Environment `development` | Environment `production` |
|--------|--------------------------|--------------------------|
| `ENV_DPCT` | Contenu du `.env` dpct pour dev | Contenu du `.env` dpct pour prod |
| `ENV_CONFERENCES` | Contenu du `.env` conferences pour dev | Contenu du `.env` conferences pour prod |

> Les repo secrets (AWS, EC2, ECR) sont automatiquement accessibles depuis tous les environments — **pas besoin de les dupliquer**.

## Environments GitHub

Créer deux environments dans **Settings → Environments** :

| Environment | Branches autorisées | Secrets |
|-------------|---------------------|---------|
| `development` | `dev` | `ENV_DPCT`, `ENV_CONFERENCES` |
| `production` | `main` | `ENV_DPCT`, `ENV_CONFERENCES` |

## Images Docker

| App | Tag dev | Tag prod |
|-----|---------|----------|
| DPCT | `protosen:dpctdev-api-latest` | `protosen:dpct-api-latest` |
| Conferences | `protosen:conferencesdev-api-latest` | `protosen:conferencesprod-api-latest` |

## Stacks Docker Swarm sur l'EC2

| App | Env | Chemin sur l'EC2 | Nom du stack |
|-----|-----|------------------|--------------|
| DPCT | dev | `/home/ec2-user/protosen/dev_env/stacks/dpct/` | `protosendev-dpctapi-stack` |
| DPCT | prod | `/home/ec2-user/protosen/prod_env/stacks/dpct/` | `protosenprod-dpctapi-stack` |
| Conferences | dev | `/home/ec2-user/protosen/dev_env/stacks/conferences/` | `protosendev-conferenceapi-stack` |
| Conferences | prod | `/home/ec2-user/protosen/prod_env/stacks/conferences/` | `protosenprod-conferenceapi-stack` |
