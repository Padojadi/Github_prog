# ⚠️ ACTION REQUISE : Configuration CORS

## 🔴 Problème actuel

Les **2 demandes de maisonthiaroye@gmail.com** existent dans la base de données mais ne sont **pas visibles** car Supabase bloque les requêtes avec une **erreur CORS**.

### Demandes qui attendent d'être traitées

1. **Diouf Hamad** - Président, Etat
   - Vol : Sangomar SNA01
   - Date : 13/02/2026, 06:00-10:00

2. **Dodo PAUL** - Ministre, MIAAE
   - Vol : Air France AF 716
   - Date : 05/02/2026, 17:30-19:00

---

## ✅ Solution rapide (5 minutes)

### Étape 1 : Dans votre application

1. Le dialogue **"Configuration CORS Requise"** s'affiche automatiquement
2. Cliquez sur **"Copier l'origine actuelle"** ou **"Copier tous les patterns"**
3. Cliquez sur **"Ouvrir Supabase Dashboard"**

### Étape 2 : Dans Supabase Dashboard

1. Sélectionnez votre projet
2. Menu de gauche → **Authentication** 🔐
3. Cliquez sur **URL Configuration**
4. Trouvez le champ **"Redirect URLs"**
5. **Collez** l'URL copiée sur une **nouvelle ligne**
6. Cliquez sur **"Save"** en bas de la page

### Étape 3 : Retour à l'application

1. Attendez **30 secondes**
2. Actualisez la page (**F5**)
3. Allez dans **"Demandes en attente"**
4. ✅ Vous voyez maintenant les 2 demandes de maisonthiaroye@gmail.com !

---

## 📋 Guide détaillé

Si vous avez besoin d'instructions plus détaillées avec captures d'écran :

👉 **Consultez le fichier : `SOLUTION_CORS_ETAPE_PAR_ETAPE.md`**

Ce guide contient :
- ✅ Captures d'écran décrites de chaque étape
- ✅ Solutions aux problèmes courants
- ✅ Alternative si les wildcards ne fonctionnent pas
- ✅ Configuration pour la production

---

## 🚀 Améliorations apportées

### Dialogue CORS amélioré

Le dialogue qui s'affiche maintenant contient :

1. ✅ **Bouton "Copier l'origine actuelle"**
   - Copie automatiquement votre URL dans le presse-papiers
   - Message de confirmation

2. ✅ **Bouton "Copier tous les patterns"**
   - Copie les wildcards pour autoriser tous les environnements de développement

3. ✅ **Bouton "Ouvrir Supabase Dashboard"**
   - Ouvre directement le Dashboard dans un nouvel onglet

4. ✅ **Instructions pas à pas**
   - Numérotées et faciles à suivre
   - Avec icônes et code formaté

### Page de diagnostic

La page `/admin/diagnostic` vous permet aussi de :
- ✅ Voir si votre JWT est synchronisé
- ✅ Voir toutes les demandes en attente dans la base de données
- ✅ Vérifier que les 2 demandes de maisonthiaroye@gmail.com existent

---

## 🎯 URLs à ajouter dans Supabase

### Option 1 : URL exacte (votre environnement actuel)

```
https://zp1v56uxy8rdx5ypatb0ockb9tr6a-oc13--3000--e5af05b3.local-credentialless.webcontainer-api.io
```

**Avantage** : Plus sécurisé
**Inconvénient** : À chaque redémarrage de l'environnement, l'URL peut changer

### Option 2 : Wildcards (recommandé pour développement)

```
https://*.webcontainer-api.io/**
https://*.local-credentialless.webcontainer-api.io/**
http://localhost:3000/**
```

**Avantage** : Fonctionne pour tous les environnements de développement
**Inconvénient** : Moins sécurisé (mais OK pour développement)

---

## ⚠️ Important

### Ce qui bloque actuellement

- ❌ Supabase refuse toutes les requêtes depuis votre environnement
- ❌ Impossible de charger les demandes en attente
- ❌ Impossible de voir les profils utilisateurs
- ❌ Le JWT ne peut pas être vérifié

### Ce qui sera débloqué après configuration CORS

- ✅ Les demandes en attente s'affichent
- ✅ Vous voyez les 2 demandes de maisonthiaroye@gmail.com
- ✅ Vous pouvez cliquer sur "Traiter la demande"
- ✅ Vous pouvez approuver ou rejeter les demandes
- ✅ Toutes les fonctionnalités admin fonctionnent

---

## 🔧 Vérification après configuration

Une fois CORS configuré, vérifiez que tout fonctionne :

### Test 1 : Page Diagnostic

1. Allez sur `/admin/diagnostic`
2. Vérifiez que vous voyez :
   - ✅ JWT correctement synchronisé
   - ✅ 2 demandes de maisonthiaroye@gmail.com

### Test 2 : Demandes en attente

1. Allez sur `/admin/pending-requests`
2. Vérifiez que vous voyez :
   - ✅ Diouf Hamad (Président, Etat)
   - ✅ Dodo PAUL (Ministre, MIAAE)
   - ✅ Bouton "Traiter la demande" cliquable

### Test 3 : Traitement d'une demande

1. Cliquez sur "Traiter la demande"
2. Vérifiez que vous pouvez :
   - ✅ Sélectionner un salon
   - ✅ Indiquer si paiement requis
   - ✅ Cliquer sur "Approuver" ou "Rejeter"

---

## 📞 Besoin d'aide ?

### Documentation disponible

1. **`SOLUTION_CORS_ETAPE_PAR_ETAPE.md`**
   - Guide complet avec toutes les étapes détaillées
   - Solutions aux problèmes courants

2. **`GUIDE_CORS_SUPABASE.md`**
   - Documentation technique sur CORS
   - Configuration pour production

3. **`GUIDE_DIAGNOSTIC_ADMIN.md`**
   - Utilisation de la page de diagnostic
   - Synchronisation du JWT

### Support technique

Si le problème persiste après configuration CORS :

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Console"
3. Partagez les erreurs affichées en rouge
4. Vérifiez votre fichier `.env` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```

---

## ✅ Résumé

**Problème** : CORS bloque l'accès aux demandes de maisonthiaroye@gmail.com

**Solution** : Ajouter votre URL dans Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

**Temps requis** : 5 minutes maximum

**Résultat** : Les 2 demandes seront visibles et vous pourrez les traiter avec les boutons d'approbation/rejet

**Action à faire MAINTENANT** :
1. Copier l'URL dans le dialogue CORS
2. Ouvrir Supabase Dashboard
3. Ajouter l'URL dans Redirect URLs
4. Sauvegarder
5. Attendre 30 secondes
6. Actualiser l'application

🚀 **C'est parti !**
