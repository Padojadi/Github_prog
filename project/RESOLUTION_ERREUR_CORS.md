# Résolution de l'Erreur CORS - Demandes en Attente

## Problème Identifié

L'erreur que vous rencontrez :
```
Access to fetch at 'https://wnlnjqidimdfrlfukvhj.supabase.co/...' has been blocked by CORS policy
```

Cette erreur se produit parce que **Supabase bloque les requêtes provenant de votre environnement de développement WebContainer**.

## Cause

Votre environnement WebContainer utilise des URLs dynamiques (qui changent) du type :
- `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--31fc58ec.local-credentialless.webcontainer-api.io`

Ces URLs ne sont pas autorisées dans la configuration de votre projet Supabase.

## Solution Rapide (5 minutes)

### 1. Ouvrir le Dashboard Supabase

1. Allez sur : **https://supabase.com/dashboard**
2. Connectez-vous
3. Sélectionnez votre projet

### 2. Configurer les URLs Autorisées

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"URL Configuration"**
3. Trouvez le champ **"Redirect URLs"**

### 3. Ajouter ces Patterns

Ajoutez les lignes suivantes dans le champ "Redirect URLs" (une par ligne) :

```
https://*.webcontainer-api.io/**
https://*.local-credentialless.webcontainer-api.io/**
http://localhost:3000/**
http://localhost:3000
```

### 4. Sauvegarder

1. Cliquez sur **"Save"** (en bas de la page)
2. Attendez **30 secondes** que les changements se propagent

### 5. Tester

1. Retournez sur votre application
2. **Actualisez la page** (F5 ou Ctrl+R)
3. Ouvrez "Demandes en attente"
4. Les demandes devraient maintenant s'afficher

## Aide Visuelle dans l'Application

Un dialogue d'aide s'affiche automatiquement quand l'erreur CORS se produit. Il contient :
- Instructions étape par étape
- L'URL actuelle à ajouter
- Liens directs vers le Dashboard Supabase

## Vérification du Succès

Après configuration, vous devriez voir dans la console :
```
✅ Loaded access requests raw data: [...]
✅ Number of access requests: X
```

Au lieu de :
```
❌ Error loading access requests: Failed to fetch
```

## Alternative : Ajouter Uniquement l'URL Actuelle

Si les wildcards ne fonctionnent pas, ajoutez l'URL exacte :

1. Dans la console du navigateur (F12), exécutez :
   ```javascript
   console.log(window.location.origin)
   ```

2. Copiez l'URL affichée (ex: `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a...`)

3. Ajoutez cette URL exacte dans les "Redirect URLs"

**Note** : Cette solution devra être répétée si l'URL WebContainer change.

## Pour la Production

Quand vous déployez votre application en production :

1. **Supprimez** les wildcards WebContainer
2. **Ajoutez** uniquement votre domaine de production :
   ```
   https://votre-domaine.com
   https://www.votre-domaine.com
   ```

## Dépannage

### L'erreur persiste après 30 secondes

1. Effacez le cache du navigateur (Ctrl+Shift+Delete)
2. Fermez et rouvrez le navigateur
3. Vérifiez que vous avez bien cliqué sur "Save" dans Supabase

### Les demandes ne s'affichent toujours pas

Si l'erreur CORS est résolue mais que les demandes ne s'affichent pas :

1. Vérifiez votre rôle dans la base de données :
   ```sql
   SELECT id, email, role FROM profiles WHERE email = 'votre-email@example.com';
   ```

2. Synchronisez votre JWT :
   - Cliquez sur le bouton "Rafraîchir session" dans la page
   - Ou déconnectez-vous et reconnectez-vous

### Comment savoir si c'est un problème CORS ou RLS ?

**Erreur CORS** :
- Message contient "CORS policy" ou "Failed to fetch"
- Se produit avant même que la requête n'atteigne Supabase
- **Solution** : Configurer les URLs autorisées

**Erreur RLS** :
- Message contient "Row Level Security" ou retourne 0 résultats
- La requête atteint Supabase mais est bloquée par les politiques
- **Solution** : Vérifier le rôle utilisateur et synchroniser le JWT

## Ressources

- **Guide détaillé** : `GUIDE_CORS_SUPABASE.md`
- **Guide des demandes d'accès** : `GUIDE_DEMANDES_ACCES.md`
- **Documentation Supabase CORS** : https://supabase.com/docs/guides/api/cors

## Support

Si le problème persiste après avoir suivi ces étapes :

1. Vérifiez les logs de la console (F12)
2. Copiez l'URL exacte affichée dans `window.location.origin`
3. Vérifiez que cette URL est bien dans les "Redirect URLs" de Supabase
4. Attendez 1-2 minutes complètes après avoir sauvegardé
