# Guide de déploiement Netlify

## ✅ Configuration automatique

Les variables d'environnement Supabase sont **automatiquement configurées** via le fichier `netlify.toml`.

Vous n'avez **rien à faire** : il suffit de pousser le code sur votre dépôt et Netlify déploiera automatiquement le site avec la bonne configuration.

### Variables configurées automatiquement :

```
NEXT_PUBLIC_SUPABASE_URL=https://wnlnjqidimdfrlfukvhj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubG5qcWlkaW1kZnJsZnVrdmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjc3NTMsImV4cCI6MjA4MTgwMzc1M30._6s1J7yXdcTgdzSr1zVkanRkDI6f3Cnv0kDuFMO8HeU
```

### Changer de projet Supabase (optionnel)

Si vous souhaitez utiliser un autre projet Supabase :

1. Modifiez le fichier `netlify.toml` à la racine du projet
2. Remplacez les valeurs dans la section `[build.environment]`
3. Ou ajoutez manuellement les variables sur Netlify Dashboard :
   - Allez dans **Site configuration** > **Environment variables**
   - Les variables manuelles ont priorité sur celles du `netlify.toml`

### Déploiement

1. Poussez votre code sur GitHub (ou autre dépôt Git)
2. Connectez le dépôt à Netlify
3. Netlify détectera automatiquement Next.js et utilisera la configuration du `netlify.toml`
4. Le site sera déployé avec toutes les variables nécessaires

## Vérification post-déploiement

Pour vérifier que tout fonctionne :
- Ouvrez le site déployé
- Essayez de vous connecter avec : `admin@test.com`
- Vérifiez que les menus d'administration apparaissent après connexion
- Testez la navigation entre les différentes pages

## Résolution de problèmes courants

### Erreur "supabaseUrl is required" pendant le build

**Solution** : Les variables d'environnement ne sont pas configurées sur Netlify.
1. Allez dans Site configuration > Environment variables
2. Ajoutez les variables listées ci-dessus
3. Redéployez

### Session non persistée après connexion

**Solution** : Le problème peut venir du stockage localStorage dans l'environnement de production.
- Vérifiez la console du navigateur pour les erreurs
- Effacez le cache et les cookies du site
- Reconnectez-vous

### Pages d'administration vides ou erreurs

**Solution** : Vérifiez que :
- Les variables d'environnement sont correctement définies
- L'utilisateur connecté a le rôle `administrator`
- Les politiques RLS sont activées dans Supabase

## Notes techniques

- Le client Supabase utilise **localStorage** pour la persistance de session
- Toutes les pages utilisant Supabase sont configurées avec `dynamic = 'force-dynamic'`
- Le build peut afficher des warnings sur Edge Runtime (normal, pas d'impact)
