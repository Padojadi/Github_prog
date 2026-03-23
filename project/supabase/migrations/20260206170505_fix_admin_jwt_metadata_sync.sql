/*
  # Synchronisation forcée des métadonnées JWT pour tous les utilisateurs
  
  Ce problème se produit lorsque les utilisateurs existants (y compris l'admin) n'ont pas
  le champ `user_role` correctement synchronisé dans leur JWT (app_metadata).
  
  Cette migration:
  1. Met à jour les raw_app_meta_data de tous les utilisateurs dans auth.users
  2. Force la synchronisation entre profiles.role et auth.users.raw_app_meta_data->user_role
  3. S'assure que l'admin peut voir toutes les demandes d'accès
  
  IMPORTANT: Les utilisateurs devront se reconnecter ou rafraîchir leur session
  pour que les changements prennent effet dans leur JWT.
*/

-- Fonction pour synchroniser les métadonnées JWT de tous les utilisateurs
DO $$
DECLARE
  user_record RECORD;
  current_metadata jsonb;
BEGIN
  -- Pour chaque utilisateur dans la table profiles
  FOR user_record IN 
    SELECT p.id, p.role, u.raw_app_meta_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
  LOOP
    -- Récupérer les métadonnées actuelles
    current_metadata := COALESCE(user_record.raw_app_meta_data, '{}'::jsonb);
    
    -- Mettre à jour user_role dans les métadonnées
    current_metadata := jsonb_set(
      current_metadata,
      '{user_role}',
      to_jsonb(user_record.role),
      true
    );
    
    -- Mettre à jour aussi le champ 'role' pour compatibilité
    current_metadata := jsonb_set(
      current_metadata,
      '{role}',
      to_jsonb(user_record.role),
      true
    );
    
    -- Appliquer la mise à jour dans auth.users
    UPDATE auth.users
    SET raw_app_meta_data = current_metadata
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Synced metadata for user % with role %', user_record.id, user_record.role;
  END LOOP;
  
  RAISE NOTICE 'Successfully synced metadata for all users';
END $$;

-- Vérification: Afficher les rôles synchronisés
DO $$
DECLARE
  sync_result RECORD;
BEGIN
  RAISE NOTICE '=== Vérification des métadonnées synchronisées ===';
  FOR sync_result IN 
    SELECT 
      u.email,
      p.role as profile_role,
      u.raw_app_meta_data->>'user_role' as jwt_user_role
    FROM auth.users u
    LEFT JOIN profiles p ON p.id = u.id
    ORDER BY u.email
  LOOP
    RAISE NOTICE 'User: % | Profile role: % | JWT user_role: %', 
      sync_result.email, 
      sync_result.profile_role, 
      sync_result.jwt_user_role;
  END LOOP;
END $$;