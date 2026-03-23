# FIX : Demandes d'accès invisibles - Problème résolu

## 🔍 Le vrai problème identifié

Les demandes d'accès n'étaient pas visibles à cause d'un **bug critique dans la fonction Edge `sync-user-metadata`**.

### Problème technique

La fonction `sync-user-metadata` utilisait un **mapping incorrect** des rôles :

```typescript
// ❌ ANCIEN CODE (INCORRECT)
const roleMapping = {
  'administrator': 'admin',        // ← transformait administrator en admin
  'lounge_manager': 'manager',     // ← transformait lounge_manager en manager
  'protocol_officer': 'agent',     // ← etc.
  ...
}
```

**Conséquence** : Quand un administrateur rafraîchissait sa session, son JWT recevait `user_role: 'admin'` au lieu de `user_role: 'administrator'`.

**Mais** les politiques RLS vérifient :
```sql
WHERE auth.jwt() -> 'app_metadata' ->> 'user_role' = 'administrator'
                                                      ^^^^^^^^^^^^^^
```

Résultat : L'administrateur avec `user_role: 'admin'` dans son JWT ne pouvait pas voir les demandes d'accès car les politiques RLS attendaient `'administrator'`.

## ✅ Solutions appliquées

### 1. Correction de la fonction Edge `sync-user-metadata`

**Fichier** : `supabase/functions/sync-user-metadata/index.ts`

**Changement** : Suppression du mapping incorrect et utilisation directe du rôle du profil :

```typescript
// ✅ NOUVEAU CODE (CORRECT)
const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
  user.id,
  {
    app_metadata: {
      user_role: profile.role,  // ← Utilise directement le rôle du profil
      role: profile.role,
    },
  }
)
```

**Status** : ✅ Fonction redéployée

### 2. Migration de resynchronisation forcée

**Fichier** : `supabase/migrations/force_resync_jwt_metadata_with_correct_roles.sql`

Cette migration a :
- ✅ Synchronisé les métadonnées JWT de TOUS les utilisateurs existants
- ✅ Utilisé les rôles EXACTS depuis la table `profiles`
- ✅ Mis à jour `raw_app_meta_data` dans `auth.users`

**Vérification** :
```sql
admin@test.com → user_role: 'administrator' ✅
andre@gmail.com → user_role: 'protocol_officer' ✅
...
```

### 3. Amélioration du bouton "Rafraîchir session"

**Fichier** : `components/admin/refresh-session-button.tsx`

Le composant a été amélioré pour :
- ✅ Toujours synchroniser les métadonnées depuis la base de données
- ✅ Forcer le rafraîchissement du JWT
- ✅ Afficher des messages informatifs pendant le processus
- ✅ Recharger automatiquement la page après succès
- ✅ Logger toutes les étapes dans la console pour debug

## 🚀 Comment résoudre le problème maintenant

### Option 1 : Utiliser le bouton "Rafraîchir session" (Recommandé)

1. **Connectez-vous** en tant qu'administrateur (admin@test.com)
2. **Allez** sur le tableau de bord admin ou "Demandes en attente"
3. **Cliquez** sur le bouton "Rafraîchir session" en haut à droite
4. **Attendez** le rechargement automatique de la page (1-2 secondes)
5. **Vérifiez** : Les 6 demandes en attente devraient maintenant être visibles

### Option 2 : Se déconnecter et se reconnecter

1. **Déconnectez-vous** de l'application
2. **Reconnectez-vous** avec vos identifiants administrateur
3. **Vérifiez** : Les demandes devraient être visibles

### Option 3 : Forcer la synchronisation via la console

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// 1. Récupérer la session actuelle
const { data: { session } } = await supabase.auth.getSession()
console.log('Current JWT:', session.user.app_metadata)

// 2. Synchroniser les métadonnées
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-user-metadata`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }
)
console.log('Sync result:', await response.json())

// 3. Rafraîchir la session
await supabase.auth.refreshSession()
console.log('Session refreshed')

// 4. Recharger la page
window.location.reload()
```

## 📊 Données attendues

Après avoir rafraîchi votre session, vous devriez voir :

### Tableau de bord admin
- Statistiques complètes incluant le nombre de demandes en attente

### Page "Demandes en attente"
**6 demandes en attente** :

1. **Dodo PAUL** (maisonthiaroye@gmail.com) - 02/02/2026
2. **Singane Diouf** (papijoe_a@gmail.com) - 24/12/2025
3. **Popol Jacques** (andre@gmail.com) - 24/12/2025
4. **Do Peters** (andre@gmail.com) - 23/12/2025
5. **Jaco DIOUF** (andre@gmail.com) - 23/12/2025
6. **Paul DIOUF** (andre@gmail.com) - 22/12/2025

## 🔧 Vérification technique

Pour vérifier que votre JWT contient les bonnes métadonnées :

```javascript
// Dans la console du navigateur (F12)
const { data: { session } } = await supabase.auth.getSession()
console.log('user_role:', session.user.app_metadata?.user_role)
// Devrait afficher : "administrator"
```

Si vous voyez `"admin"` ou `undefined`, rafraîchissez votre session.

## 📝 Notes importantes

### Pour l'administrateur
- ✅ Votre rôle dans la base de données est correct : `administrator`
- ✅ Les politiques RLS sont correctes et vérifient `administrator`
- ✅ La migration a mis à jour vos métadonnées JWT dans la base de données
- ⚠️ Vous devez rafraîchir votre session pour obtenir un nouveau JWT avec les métadonnées correctes

### Pourquoi le problème persistait
Même après la première migration, le problème persistait car :
1. La migration mettait à jour la base de données ✅
2. Mais votre session existante utilisait toujours l'ancien JWT ❌
3. Quand vous cliquiez sur "Rafraîchir session", la fonction `sync-user-metadata` appliquait le mauvais mapping ❌
4. Résultat : Vous obteniez un nouveau JWT avec `user_role: 'admin'` au lieu de `'administrator'` ❌

### Maintenant que c'est corrigé
1. La fonction `sync-user-metadata` utilise le rôle exact ✅
2. La migration a synchronisé tous les utilisateurs ✅
3. Quand vous rafraîchissez, vous obtenez `user_role: 'administrator'` ✅
4. Les politiques RLS vous autorisent à voir les demandes ✅

## 🎯 Résultat attendu

Après avoir suivi les étapes ci-dessus, vous devriez pouvoir :
- ✅ Voir toutes les demandes d'accès en attente
- ✅ Approuver ou rejeter les demandes
- ✅ Voir les statistiques correctes dans le tableau de bord
- ✅ Accéder à toutes les fonctionnalités admin

## 🆘 Dépannage

### Si les demandes ne s'affichent toujours pas

1. **Ouvrez la console du navigateur** (F12)
2. **Vérifiez votre JWT** :
   ```javascript
   const { data: { session } } = await supabase.auth.getSession()
   console.log('user_role:', session.user.app_metadata?.user_role)
   ```
3. **Vérifiez les erreurs de chargement** :
   - Regardez les logs dans la console
   - Les messages commencent par 🔍, ✅, ❌, ⚠️

4. **Si vous voyez toujours `user_role: 'admin'` ou `undefined`** :
   - Cliquez sur "Rafraîchir session" une nouvelle fois
   - Ou déconnectez-vous et reconnectez-vous

5. **Contactez le support technique** avec :
   - Les logs de la console
   - Le résultat de la vérification JWT ci-dessus
   - Des captures d'écran si possible

## ✨ Prochaines connexions

Pour les futures connexions, tout fonctionnera automatiquement car :
- ✅ La fonction `sync-user-metadata` est corrigée
- ✅ Les métadonnées dans la base de données sont correctes
- ✅ Les nouveaux JWT contiendront les bons rôles
- ✅ Les politiques RLS fonctionnent correctement
