# Guide de Configuration CORS pour Supabase

## Problème

Erreur lors du chargement des demandes avec le message :
```
The 'Access-Control-Allow-Origin' header has a value that is not equal to the supplied origin
```

Cette erreur se produit car Supabase bloque les requêtes provenant d'origines non autorisées.

## Solution

### Étape 1 : Accéder au Dashboard Supabase

1. Ouvrez votre navigateur et allez sur : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet (celui qui contient votre base de données)

### Étape 2 : Configurer les URLs Autorisées

#### A. Configuration de l'URL du Site

1. Dans le menu de gauche, cliquez sur **"Settings"** (Paramètres)
2. Cliquez sur **"API"**
3. Trouvez la section **"Project URL"** ou **"Site URL"**
4. Notez l'URL actuelle de votre environnement de développement (elle ressemble à) :
   ```
   https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--31fc58ec.local-credentialless.webcontainer-api.io
   ```

#### B. Configuration de l'Authentification

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"URL Configuration"**
3. Vous verrez plusieurs champs :
   - **Site URL** : Mettez votre URL de production (ou laissez par défaut)
   - **Redirect URLs** : C'est ici que vous devez ajouter les URLs autorisées

#### C. Ajouter les URLs Autorisées

Dans le champ **"Redirect URLs"**, ajoutez les patterns suivants (un par ligne) :

```
https://*.webcontainer-api.io/**
https://*.local-credentialless.webcontainer-api.io/**
http://localhost:3000/**
http://localhost:3000
https://localhost:3000/**
https://localhost:3000
```

#### D. Configurer les Origines CORS Supplémentaires

1. Toujours dans **"Authentication"** → **"URL Configuration"**
2. Cherchez la section **"Additional Redirect URLs"** ou **"Allowed Origins"**
3. Si disponible, ajoutez aussi :
   ```
   *://*.webcontainer-api.io
   *://*.local-credentialless.webcontainer-api.io
   ```

### Étape 3 : Sauvegarder et Attendre

1. Cliquez sur **"Save"** (Sauvegarder)
2. Attendez **30 secondes à 1 minute** que les changements se propagent
3. Actualisez votre application

### Étape 4 : Vérifier la Configuration

1. Retournez sur votre application
2. Ouvrez la console du navigateur (F12)
3. Accédez à "Demandes en attente"
4. Si vous voyez toujours l'erreur :
   - Effacez le cache du navigateur (Ctrl+Shift+Delete)
   - Fermez et rouvrez le navigateur
   - Réessayez

## Alternative : Utiliser une Configuration Plus Permissive (Développement Uniquement)

Si les wildcards ne fonctionnent pas, voici une approche alternative :

### Option A : Désactiver CORS temporairement (Développement seulement)

⚠️ **ATTENTION** : Ne faites cela que pour le développement, JAMAIS en production !

1. Allez dans **Settings** → **API**
2. Cherchez les options CORS
3. Activez l'option pour permettre toutes les origines (si disponible)

### Option B : Configuration RLS au lieu de CORS

Le problème peut aussi venir des politiques RLS. Pour vérifier :

1. Allez dans **Database** → **Policies**
2. Cherchez la table `access_requests`
3. Vérifiez que ces politiques existent :
   - "Staff can view all access requests"
   - "Staff can update access requests"
   - "Users can view own access requests"
   - "Users can create own access requests"

## Dépannage

### Erreur persiste après configuration CORS

Si l'erreur persiste, vérifiez dans la console :

```javascript
// Ouvrez la console (F12) et exécutez :
console.log(window.location.origin)
```

Copiez cette valeur exacte et ajoutez-la dans les Redirect URLs de Supabase.

### Vérifier les variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_ici
```

### Tester avec curl

Depuis votre terminal, testez si Supabase répond :

```bash
curl -H "apikey: VOTRE_ANON_KEY" \
     -H "Authorization: Bearer VOTRE_ANON_KEY" \
     "https://votre-projet.supabase.co/rest/v1/access_requests?select=*"
```

Si cela fonctionne, le problème est bien CORS. Si cela échoue, vérifiez vos clés API.

## Configuration pour la Production

Quand vous déployez en production :

1. Supprimez les wildcards WebContainer
2. Ajoutez uniquement votre domaine de production :
   ```
   https://votre-domaine.com
   https://www.votre-domaine.com
   ```

## Ressources Supplémentaires

- [Documentation Supabase CORS](https://supabase.com/docs/guides/api/cors)
- [Documentation Supabase Authentication URL Configuration](https://supabase.com/docs/guides/auth/redirect-urls)
