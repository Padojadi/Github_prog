# Guide - Page de Diagnostic Administrateur

## Problème résolu

Les demandes d'accès de l'utilisateur **maisonthiaroye@gmail.com** (Macoumba Sonko) ne sont pas visibles dans le dossier "Demandes en attente" pour l'administrateur.

## Cause

Le JWT (JSON Web Token) de l'administrateur ne contient pas le bon `user_role` dans ses métadonnées `app_metadata`, ce qui empêche les politiques RLS (Row Level Security) de lui donner accès aux demandes.

## Solution : Page de Diagnostic JWT

Une nouvelle page de diagnostic a été créée pour aider l'administrateur à :
1. Vérifier l'état de son JWT
2. Voir toutes les demandes en attente dans la base de données
3. Synchroniser automatiquement son JWT si nécessaire

### Accès à la page

**URL** : `/admin/diagnostic`

**Lien dans le sidebar** : "Diagnostic JWT" (icône bouclier 🛡️)

## Comment utiliser la page de diagnostic

### Étape 1 : Ouvrir la page de diagnostic

Connectez-vous en tant qu'administrateur et cliquez sur **"Diagnostic JWT"** dans le menu de gauche.

### Étape 2 : Vérifier l'état du JWT

La page affiche deux sections principales :

#### Section 1 : État du JWT

```
┌─────────────────────────────────────┐
│ État du JWT                         │
├─────────────────────────────────────┤
│ Profile dans la base de données :   │
│   Email: admin@test.com             │
│   Rôle: administrator ✅            │
│                                     │
│ JWT (app_metadata) :                │
│   Email: admin@test.com             │
│   user_role: administrator ✅       │
│                                     │
│ Status de synchronisation :         │
│ ✅ JWT correctement synchronisé     │
└─────────────────────────────────────┘
```

**Si le JWT est désynchronisé**, vous verrez :

```
┌─────────────────────────────────────┐
│ État du JWT                         │
├─────────────────────────────────────┤
│ Profile dans la base de données :   │
│   Email: admin@test.com             │
│   Rôle: administrator ✅            │
│                                     │
│ JWT (app_metadata) :                │
│   Email: admin@test.com             │
│   user_role: MANQUANT ❌            │
│                                     │
│ Status de synchronisation :         │
│ ⚠️ JWT non synchronisé              │
└─────────────────────────────────────┘
```

#### Section 2 : Demandes d'accès en attente

Cette section affiche **toutes** les demandes en attente dans la base de données, même si votre JWT n'est pas synchronisé.

**Actuellement, il y a 2 demandes de maisonthiaroye@gmail.com** :

1. **Diouf Hamad** (Président, Etat)
   - Créée le : 06/02/2026 19:06
   - Badge spécial : maisonthiaroye@gmail.com

2. **Dodo PAUL** (Ministre, MIAAE)
   - Créée le : 02/02/2026 10:17
   - Badge spécial : maisonthiaroye@gmail.com

### Étape 3 : Synchroniser le JWT (si nécessaire)

Si votre JWT n'est pas synchronisé :

1. **Cliquez sur "Forcer la synchronisation"** en haut de la page
2. Attendez le message "JWT synchronisé ! Rechargement..."
3. La page se recharge automatiquement
4. Votre JWT est maintenant à jour

### Étape 4 : Accéder aux demandes en attente

Une fois le JWT synchronisé, un message vert s'affiche :

```
✅ Votre JWT est synchronisé. Ces demandes devraient être visibles
   dans "Demandes en attente"

   [Aller aux demandes en attente]
```

Cliquez sur le bouton **"Aller aux demandes en attente"** pour accéder à la page de gestion.

## Après la synchronisation

Une fois le JWT synchronisé, vous pourrez :

1. ✅ Voir les 2 demandes de **maisonthiaroye@gmail.com** dans "Demandes en attente"
2. ✅ Cliquer sur "Traiter la demande" pour chaque demande
3. ✅ Approuver ou rejeter les demandes avec les boutons de validation

### Traitement d'une demande

Pour chaque demande, vous pouvez :

1. **Approuver** :
   - Sélectionner un salon
   - Indiquer si paiement requis et le montant
   - Ajouter une note (optionnel)
   - Cliquer sur "Approuver"

2. **Rejeter** :
   - Indiquer la raison du rejet (obligatoire)
   - Cliquer sur "Rejeter"

## Détails des 2 demandes de maisonthiaroye@gmail.com

### Demande 1 : Diouf Hamad

- **Nom** : Diouf Hamad
- **Fonction** : Président
- **Organisation** : Etat
- **Nationalité** : Sénégalaise
- **Téléphone** : (voir dans l'interface)
- **Vol** : Sangomar SNA01
- **Date** : 13/02/2026
- **Horaire** : 06:00 - 10:00
- **Status** : En attente

### Demande 2 : Dodo PAUL

- **Nom** : Dodo PAUL
- **Fonction** : Ministre
- **Organisation** : MIAAE
- **Nationalité** : Sénégalaise
- **Téléphone** : (voir dans l'interface)
- **Vol** : Air France AF 716
- **Date** : 05/02/2026
- **Horaire** : 17:30 - 19:00
- **Status** : En attente

## Fonctionnalités supplémentaires de la page de diagnostic

### 1. Bouton "Actualiser"

Recharge les informations du JWT et les demandes depuis la base de données.

### 2. Section "Informations techniques"

Pour le débogage avancé :
- Affiche le JWT `app_metadata` complet au format JSON
- Bouton "Afficher dans la console" pour voir toutes les infos dans la console du navigateur
- Bouton "Retour au dashboard"

### 3. Auto-détection

La page détecte automatiquement :
- Si votre JWT est synchronisé ou non
- Combien de demandes sont en attente
- Quelles demandes proviennent de maisonthiaroye@gmail.com

## Prévention future : AutoSyncJWT

Le composant `AutoSyncJWT` a été intégré dans le layout du dashboard. Il :

- ✅ Détecte automatiquement si votre JWT est désynchronisé
- ✅ Lance automatiquement la synchronisation au chargement
- ✅ Rafraîchit la page une fois la synchronisation terminée

**Vous ne devriez donc plus avoir ce problème à l'avenir !**

Cependant, si le problème persiste, la page de diagnostic est toujours disponible pour :
- Vérifier manuellement l'état de votre JWT
- Forcer une synchronisation manuelle
- Voir toutes les demandes en attente

## Résumé : Étapes pour voir les demandes de maisonthiaroye@gmail.com

1. ✅ Connectez-vous en tant qu'administrateur
2. ✅ Allez sur `/admin/diagnostic` (Diagnostic JWT dans le menu)
3. ✅ Vérifiez l'état de votre JWT
4. ✅ Si désynchronisé, cliquez sur "Forcer la synchronisation"
5. ✅ Attendez le rechargement automatique
6. ✅ Cliquez sur "Aller aux demandes en attente"
7. ✅ Vous voyez maintenant les 2 demandes de **maisonthiaroye@gmail.com**
8. ✅ Traitez chaque demande : Approuver ou Rejeter

## Support technique

Si vous voyez les demandes dans la page de diagnostic mais pas dans "Demandes en attente" après synchronisation :

1. Ouvrez la console du navigateur (F12)
2. Cliquez sur "Afficher dans la console" dans la section "Informations techniques"
3. Vérifiez les logs pour `JWT Info`, `Profile`, et `Requests`
4. Partagez ces informations avec le support technique

## Fichiers modifiés

- ✅ `app/(dashboard)/admin/diagnostic/page.tsx` (nouveau)
- ✅ `components/layout/sidebar.tsx` (lien ajouté)
- ✅ `components/admin/auto-sync-jwt.tsx` (synchronisation automatique)
- ✅ `app/(dashboard)/layout.tsx` (AutoSyncJWT intégré)

## Conclusion

La page de diagnostic est un outil puissant pour :
- Diagnostiquer les problèmes de JWT
- Voir toutes les demandes en attente
- Synchroniser manuellement le JWT si nécessaire
- Vérifier que les demandes sont accessibles

Les 2 demandes de **maisonthiaroye@gmail.com** sont bien dans la base de données et deviendront visibles dans "Demandes en attente" dès que votre JWT sera correctement synchronisé.
