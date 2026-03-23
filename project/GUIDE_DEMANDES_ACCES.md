# Guide - Demandes d'Accès et Tableau de Bord

## Problème Résolu

Les demandes d'accès créées par les utilisateurs n'étaient pas visibles par l'administrateur à cause d'un problème de politiques RLS (Row Level Security) dans la base de données.

## Solutions Implémentées

### 1. Correction des Politiques RLS

Une nouvelle migration a été créée pour corriger les politiques de sécurité de la table `access_requests` :

**Fichier**: `supabase/migrations/[timestamp]_fix_access_requests_rls_policies.sql`

**Changements** :
- ✅ Correction du chemin JWT pour accéder au rôle utilisateur
- ✅ Permission pour les utilisateurs de voir leurs propres demandes
- ✅ Permission pour le staff (admin, manager, agent) de voir **TOUTES** les demandes
- ✅ Permission pour le staff de mettre à jour les demandes
- ✅ Permission pour les utilisateurs de créer des demandes

### 2. Synchronisation Automatique JWT

Ajout d'un système de synchronisation automatique du JWT dans :
- ✅ Page "Demandes en attente" (`/admin/pending-requests`)
- ✅ Page "Tableau de bord" (`/admin`)

Ce système garantit que le rôle de l'utilisateur est correctement présent dans le JWT.

### 3. Mise à Jour en Temps Réel

Ajout d'un canal de mise à jour en temps réel pour `access_requests` dans le tableau de bord admin, permettant de voir les nouvelles demandes instantanément.

## Comment Vérifier que Tout Fonctionne

### Étape 1: Vérifier le Rôle de l'Administrateur

1. Connectez-vous en tant qu'administrateur
2. Ouvrez la console du navigateur (F12)
3. Accédez à la page "Demandes en attente"
4. Vous devriez voir dans la console :
   ```
   🔍 Current JWT user_role: admin
   ```

### Étape 2: Tester la Visibilité des Demandes

1. **En tant qu'utilisateur normal** :
   - Créez une nouvelle demande d'accès via `/access-request`
   - Vérifiez qu'elle apparaît dans "Mes demandes" (`/my-requests`)

2. **En tant qu'administrateur** :
   - Accédez à "Demandes en attente" (`/admin/pending-requests`)
   - Vous devriez voir **toutes** les demandes avec status "pending"
   - Vérifiez le tableau de bord (`/admin`) :
     - "Total Demandes" : toutes les demandes
     - "En attente" : demandes avec status "pending"
     - "Approuvées" : demandes avec status "approved"
     - "Rejetées" : demandes avec status "rejected"

### Étape 3: Tester le Flux Complet

1. **Création de demande (utilisateur)** :
   - L'utilisateur crée une demande
   - Status initial : "pending"
   - Visible dans "Mes demandes"
   - Comptée dans "Total Demandes" et "En attente" du tableau de bord admin

2. **Validation (admin)** :
   - Admin voit la demande dans "Demandes en attente"
   - Admin peut approuver ou rejeter
   - Lors de l'approbation :
     - Sélection du salon
     - Validation des accompagnants
     - Génération automatique du QR code

3. **Après validation** :
   - Status change à "approved" ou "rejected"
   - Déplacée de "En attente" vers "Approuvées" ou "Rejetées" dans les stats
   - QR code disponible pour le demandeur (si approuvée)

## Statistiques du Tableau de Bord

Le tableau de bord admin affiche maintenant 8 cartes principales :

### Demandes d'Accès (4 cartes)
1. **Total Demandes** : Nombre total de demandes d'accès
2. **En attente** : Demandes avec status "pending"
3. **Approuvées** : Demandes avec status "approved"
4. **Rejetées** : Demandes avec status "rejected"

### Autres Statistiques (4 cartes existantes)
5. Salons actifs
6. Réservations
7. Revenus
8. Utilisateurs

## Dépannage

### Si les demandes ne s'affichent pas :

1. **Vérifier le rôle dans la base de données** :
   ```sql
   SELECT id, email, role FROM profiles WHERE email = 'votre-email@example.com';
   ```
   Le rôle doit être : `administrator`, `admin`, `lounge_manager`, ou `protocol_officer`

2. **Forcer la synchronisation JWT** :
   - Déconnectez-vous
   - Reconnectez-vous
   - Ou actualisez la page "Demandes en attente" (le système synchronise automatiquement)

3. **Vérifier les logs de la console** :
   - Ouvrez la console du navigateur (F12)
   - Recherchez les messages d'erreur
   - Les logs préfixés par 🔍, ✅, ou ❌ donnent des informations détaillées

### Si les statistiques sont à zéro :

1. Vérifiez que des demandes existent dans la base de données
2. Actualisez le tableau de bord
3. Vérifiez les logs de la console pour les erreurs de requête

## Support Technique

Si le problème persiste :
1. Vérifiez que la migration RLS a bien été appliquée
2. Consultez les logs Supabase
3. Vérifiez que l'utilisateur admin a le bon rôle dans `profiles.role`
