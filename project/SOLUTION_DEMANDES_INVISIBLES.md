# Solution : Demandes d'accès invisibles pour l'administrateur

## Problème identifié

Les demandes d'accès ne s'affichaient pas dans le tableau de bord de l'administrateur ni dans la section "Demandes en attente" pour deux raisons principales :

### 1. Politiques RLS incorrectes
Les politiques Row Level Security (RLS) sur la table `access_requests` cherchaient le rôle 'admin' alors que le système utilise 'administrator'.

### 2. Métadonnées JWT non synchronisées
Les utilisateurs existants (y compris l'admin) n'avaient pas le champ `user_role` correctement synchronisé dans leur JWT (token d'authentification). Les politiques RLS vérifient ce champ pour autoriser l'accès aux données.

## Solutions appliquées

### ✅ Correction des politiques RLS
Une migration a été créée pour mettre à jour toutes les politiques RLS avec les bons noms de rôles :
- `administrator` (au lieu de 'admin')
- `lounge_manager`
- `receptionist`
- `agent`

### ✅ Synchronisation des métadonnées JWT
Une migration a été appliquée pour synchroniser automatiquement les métadonnées JWT de tous les utilisateurs existants en se basant sur leur rôle dans la table `profiles`.

### ✅ Bouton "Rafraîchir session"
Un nouveau composant a été ajouté dans les pages admin pour permettre de rafraîchir facilement la session et obtenir un nouveau JWT avec les bonnes métadonnées.

## Comment utiliser la solution

### Pour que les demandes s'affichent immédiatement :

1. **Connectez-vous en tant qu'administrateur** (admin@test.com)

2. **Allez sur le tableau de bord admin** ou la page "Demandes en attente"

3. **Cliquez sur le bouton "Rafraîchir session"** (en haut à droite)
   - Ce bouton force la synchronisation de vos métadonnées JWT
   - La page se rechargera automatiquement après quelques secondes

4. **Les demandes d'accès devraient maintenant être visibles**

### Alternative : Se déconnecter et se reconnecter

Si le bouton "Rafraîchir session" ne fonctionne pas :
1. Déconnectez-vous de l'application
2. Reconnectez-vous avec vos identifiants administrateur
3. Votre nouvelle session aura les bonnes métadonnées JWT

## Vérification

Après avoir rafraîchi votre session, vous devriez voir :
- **Dans le tableau de bord admin** : Les statistiques incluant le nombre de demandes en attente
- **Dans "Demandes en attente"** : La liste complète des 6 demandes pending actuellement dans la base de données

## Données actuelles

La base de données contient actuellement :
- **6 demandes d'accès** avec le statut "pending"
- Créées par 3 utilisateurs différents :
  - andre@gmail.com (protocol_officer)
  - papijoe_a@gmail.com (applicant)
  - maisonthiaroye@gmail.com (protocol_officer)

## Détails techniques

### Rôles supportés
- `administrator` : Accès complet à toutes les fonctionnalités admin
- `lounge_manager` : Gestion des salons
- `receptionist` : Accueil et gestion des réservations
- `agent` : Agent de service
- `protocol_officer` : Officier de protocole (peut créer des demandes)
- `applicant` : Demandeur simple

### Politiques RLS mises à jour
- `access_requests` : Les administrateurs peuvent voir et gérer toutes les demandes
- `profiles` : Les administrateurs peuvent voir tous les profils utilisateurs
- `bookings` : Les administrateurs ont accès complet à toutes les réservations

### Champ JWT vérifié
Les politiques RLS vérifient : `auth.jwt() -> 'app_metadata' -> 'user_role'`

Ce champ est maintenant automatiquement synchronisé lors de :
- La création d'un nouvel utilisateur
- La modification du rôle d'un utilisateur
- Le rafraîchissement manuel de la session

## Support

Si le problème persiste après avoir rafraîchi votre session :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que vous êtes bien connecté en tant qu'administrateur
3. Essayez de vous déconnecter et de vous reconnecter
4. Contactez le support technique avec les logs de la console
