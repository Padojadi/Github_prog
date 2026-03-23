/*
  # Force Resync JWT metadata avec les rôles corrects
  
  ## Problème identifié
  
  La fonction sync-user-metadata utilisait un mapping incorrect qui transformait:
  - 'administrator' → 'admin'
  - 'lounge_manager' → 'manager'
  - etc.
  
  Mais les politiques RLS vérifient les rôles originaux ('administrator', 'lounge_manager', etc.)
  
  ## Solution
  
  Cette migration force la resynchronisation de TOUS les utilisateurs avec leurs rôles
  EXACTS depuis la table profiles, sans aucun mapping.
  
  ## Actions
  
  1. Met à jour les raw_app_meta_data de tous les utilisateurs
  2. Utilise le rôle EXACT depuis profiles.role
  3. Stocke dans app_metadata->user_role ET app_metadata->role
  
  ## Après cette migration
  
  L'administrateur (et tous les utilisateurs) devront:
  - Cliquer sur "Rafraîchir session" OU
  - Se déconnecter et se reconnecter
  
  Pour obtenir un nouveau JWT avec les métadonnées correctes.
*/

-- Forcer la synchronisation avec les rôles corrects (sans mapping)
DO $$
DECLARE
  user_record RECORD;
  current_metadata jsonb;
BEGIN
  RAISE NOTICE '=== Début de la resynchronisation forcée ===';
  
  -- Pour chaque utilisateur dans la table profiles
  FOR user_record IN 
    SELECT p.id, p.role, p.email, u.raw_app_meta_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
    ORDER BY p.email
  LOOP
    -- Récupérer les métadonnées actuelles
    current_metadata := COALESCE(user_record.raw_app_meta_data, '{}'::jsonb);
    
    -- Mettre à jour user_role avec le rôle EXACT (sans mapping)
    current_metadata := jsonb_set(
      current_metadata,
      '{user_role}',
      to_jsonb(user_record.role::text),
      true
    );
    
    -- Mettre à jour aussi le champ 'role' pour compatibilité
    current_metadata := jsonb_set(
      current_metadata,
      '{role}',
      to_jsonb(user_record.role::text),
      true
    );
    
    -- Appliquer la mise à jour dans auth.users
    UPDATE auth.users
    SET raw_app_meta_data = current_metadata,
        updated_at = now()
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Synced: % (%) → user_role=%', 
      user_record.email, 
      user_record.id, 
      user_record.role;
  END LOOP;
  
  RAISE NOTICE '=== Resynchronisation terminée ===';
END $$;

-- Vérification finale: Afficher tous les rôles synchronisés
DO $$
DECLARE
  sync_result RECORD;
  total_count INTEGER := 0;
  admin_count INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== Vérification des métadonnées JWT ===';
  RAISE NOTICE '';
  
  FOR sync_result IN 
    SELECT 
      u.email,
      p.role::text as profile_role,
      u.raw_app_meta_data->>'user_role' as jwt_user_role,
      u.raw_app_meta_data->>'role' as jwt_role
    FROM auth.users u
    LEFT JOIN profiles p ON p.id = u.id
    ORDER BY u.email
  LOOP
    total_count := total_count + 1;
    
    IF sync_result.jwt_user_role = 'administrator' THEN
      admin_count := admin_count + 1;
    END IF;
    
    RAISE NOTICE 'Email: % | Profile: % | JWT user_role: % | JWT role: %', 
      sync_result.email, 
      COALESCE(sync_result.profile_role, 'NO_PROFILE'),
      COALESCE(sync_result.jwt_user_role, 'NO_JWT'),
      COALESCE(sync_result.jwt_role, 'NO_JWT');
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== Résumé ===';
  RAISE NOTICE 'Total utilisateurs: %', total_count;
  RAISE NOTICE 'Administrateurs: %', admin_count;
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Les utilisateurs doivent rafraîchir leur session ou se reconnecter';
  RAISE NOTICE '    pour obtenir un nouveau JWT avec les métadonnées mises à jour.';
  RAISE NOTICE '';
END $$;