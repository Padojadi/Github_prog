# 🔧 Diagnostic CORS Rapide

## Vous ne voyez toujours pas les demandes après configuration CORS ?

J'ai créé un **outil de diagnostic avancé** qui va identifier **exactement** quel est le problème.

---

## 🎯 Utiliser l'outil de diagnostic

### Étape 1 : Accéder à l'outil

Vous avez **3 façons** d'accéder à l'outil :

#### Option A : Depuis la page "Demandes en attente"
1. Allez sur `/admin/pending-requests`
2. Cliquez sur le bouton **"Test CORS"** en haut à droite

#### Option B : Depuis le dialogue CORS
1. Dans le dialogue "Configuration CORS Requise"
2. Cliquez sur le lien **"utilisez l'outil de diagnostic avancé"** en bas

#### Option C : URL directe
1. Allez directement sur : `/admin/test-cors`

---

### Étape 2 : Lancer les tests

1. ✅ Sur la page **"Test CORS & Diagnostic"**
2. ✅ Cliquez sur le bouton **"Lancer les tests"**
3. ✅ Attendez 3-5 secondes pendant que les tests s'exécutent

---

### Étape 3 : Interpréter les résultats

L'outil va tester **6 points critiques** :

#### Test 1 : Session Utilisateur
- ✅ **Succès** : Votre session est valide
- ❌ **Échec** : Problème d'authentification, reconnectez-vous
- ⚠️ **user_role = NON SYNCHRONISÉ** : Cliquez sur "Rafraîchir session"

#### Test 2 : API REST Supabase (TEST CORS)
- ✅ **Succès** : CORS est correctement configuré ✅
- ❌ **🔴 ERREUR CORS DÉTECTÉE** : Votre origine n'est PAS autorisée dans Supabase

**Si ce test échoue avec "ERREUR CORS DÉTECTÉE" :**
1. Vous n'avez **pas encore configuré CORS** dans Supabase
2. Ou vous avez mal configuré (mauvaise URL, mauvais champ)
3. Ou les changements ne se sont pas encore propagés (attendez 1 minute)

#### Test 3 : Requête Profiles
- ✅ **Succès** : Les politiques RLS fonctionnent
- ❌ **Échec** : Problème RLS sur la table profiles

#### Test 4 : Comptage Demandes en Attente
- ✅ **X demande(s) trouvée(s)** : Les demandes existent dans la base
- ✅ **0 demande** : Il n'y a vraiment aucune demande en attente

#### Test 5 : Requête Demandes (sans JOIN)
- ✅ **Succès** : Les demandes sont accessibles
- Affiche les demandes brutes avec tous leurs champs

#### Test 6 : Requête Demandes (avec JOIN profiles)
- ✅ **Succès** : La jointure fonctionne, les demandes sont visibles ✅
- ❌ **Échec** : Problème RLS qui bloque la jointure

---

## 📊 Scénarios courants

### Scénario 1 : Test 2 échoue avec "ERREUR CORS"

**Cause** : CORS n'est PAS configuré ou mal configuré

**Solution** :
1. Ouvrez le Dashboard Supabase
2. Allez dans Authentication → URL Configuration
3. Dans le champ "Redirect URLs", ajoutez l'URL affichée dans le Test #2
4. Sauvegardez
5. Attendez 60 secondes
6. Relancez les tests

---

### Scénario 2 : Test 2 réussit, Test 6 échoue

**Cause** : CORS est OK, mais le JWT n'a pas le bon rôle ou les politiques RLS bloquent

**Solution A : JWT non synchronisé**
1. Si Test 1 affiche "user_role = NON SYNCHRONISÉ"
2. Retournez sur `/admin/pending-requests`
3. Cliquez sur "Rafraîchir session"
4. Attendez le rechargement
5. Relancez les tests

**Solution B : Politiques RLS**
1. Vérifiez que votre JWT contient `user_role = 'administrator'`
2. Si ce n'est pas le cas, consultez `GUIDE_DIAGNOSTIC_ADMIN.md`

---

### Scénario 3 : Test 4 affiche "0 demande"

**Cause** : Il n'y a vraiment aucune demande en attente dans la base

**Vérification** :
1. Les demandes ont peut-être été traitées (approuvées/rejetées)
2. Ou les demandes n'ont pas été créées correctement
3. Allez sur `/admin/diagnostic` pour voir toutes les demandes (tous status)

---

### Scénario 4 : Test 4 affiche "2 demandes", mais Test 6 affiche "0 demande"

**Cause** : Les demandes existent MAIS les politiques RLS bloquent la jointure avec profiles

**Solution** :
1. Vérifiez Test 1 : Si "user_role = NON SYNCHRONISÉ"
   - Cliquez sur "Rafraîchir session"
2. Si Test 1 affiche un rôle, mais pas 'administrator'
   - Votre compte n'a pas le bon rôle
   - Consultez `GUIDE_DIAGNOSTIC_ADMIN.md` pour corriger

---

### Scénario 5 : Tous les tests réussissent

**Cause** : Tout fonctionne ! Les demandes devraient être visibles

**Action** :
1. Retournez sur `/admin/pending-requests`
2. Cliquez sur "Actualiser"
3. Les demandes devraient maintenant être visibles
4. Si ce n'est toujours pas le cas, videz le cache du navigateur (Ctrl+Shift+Delete)

---

## 🎯 Résumé en 3 étapes

1. **Allez sur** `/admin/test-cors`
2. **Cliquez** sur "Lancer les tests"
3. **Lisez** le "Résumé & Recommandations" en bas de page

Le résumé vous dira **exactement** quel est le problème et comment le résoudre.

---

## 🔍 Détails techniques

### Que teste l'outil ?

1. **Environnement** : Votre origine actuelle et URL Supabase
2. **Session** : Votre authentification et JWT (user_role)
3. **CORS** : Si Supabase accepte les requêtes depuis votre origine
4. **RLS Profiles** : Si vous pouvez lire la table profiles
5. **RLS Access Requests** : Si vous pouvez lire la table access_requests
6. **Jointure** : Si vous pouvez faire un JOIN entre access_requests et profiles

### Pourquoi ces tests ?

La page "Demandes en attente" fait une requête avec JOIN :
```sql
SELECT access_requests.*, profiles.*
FROM access_requests
JOIN profiles ON access_requests.user_id = profiles.id
WHERE status = 'pending'
```

Si **un seul élément** de cette chaîne échoue, rien ne s'affiche :
- ❌ CORS → Requête bloquée
- ❌ JWT sans user_role → RLS bloque tout
- ❌ RLS profiles → JOIN échoue
- ❌ RLS access_requests → Rien à joindre

L'outil teste **chaque élément séparément** pour identifier le maillon faible.

---

## 📞 Toujours bloqué ?

Si après avoir utilisé l'outil de diagnostic et suivi les recommandations, le problème persiste :

1. **Partagez les résultats** du diagnostic (faites une capture d'écran)
2. **Ouvrez la console** du navigateur (F12) et partagez les erreurs en rouge
3. **Vérifiez votre fichier .env** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```

---

## ✅ Une fois résolu

Quand tous les tests passent au vert :
1. ✅ Retournez sur `/admin/pending-requests`
2. ✅ Cliquez sur "Actualiser"
3. ✅ Vous verrez les 2 demandes de **maisonthiaroye@gmail.com**
4. ✅ Vous pourrez cliquer sur "Traiter la demande"
5. ✅ Vous pourrez approuver ou rejeter chaque demande

**Bon diagnostic ! 🚀**
