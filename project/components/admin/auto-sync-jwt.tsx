'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function AutoSyncJWT() {
  const [hasSynced, setHasSynced] = useState(false)

  useEffect(() => {
    if (hasSynced) return

    const checkAndSyncJWT = async () => {
      try {
        console.log('🔍 [AutoSync] Checking JWT status...')

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.log('🔍 [AutoSync] No session found, skipping')
          return
        }

        const userId = session.user.id
        const userEmail = session.user.email
        const currentUserRole = session.user.app_metadata?.user_role

        console.log('🔍 [AutoSync] User:', userEmail)
        console.log('🔍 [AutoSync] Current user_role in JWT:', currentUserRole)

        const supabaseAdmin = supabase

        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle()

        if (profileError) {
          console.error('❌ [AutoSync] Error loading profile:', profileError)
          return
        }

        if (!profile) {
          console.log('⚠️ [AutoSync] No profile found for user')
          return
        }

        const profileRole = (profile as any).role
        console.log('🔍 [AutoSync] Profile role in DB:', profileRole)

        if (currentUserRole === profileRole) {
          console.log('✅ [AutoSync] JWT is already in sync')
          setHasSynced(true)
          return
        }

        console.warn('⚠️ [AutoSync] JWT is OUT OF SYNC!')
        console.warn(`⚠️ [AutoSync] DB role: ${profileRole}`)
        console.warn(`⚠️ [AutoSync] JWT role: ${currentUserRole}`)
        console.log('🔄 [AutoSync] Starting automatic synchronization...')

        toast.info('Synchronisation automatique en cours...', {
          description: 'Mise à jour de vos permissions',
          duration: 3000,
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-user-metadata`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ [AutoSync] Sync failed:', errorText)
          toast.error('Erreur de synchronisation', {
            description: 'Cliquez sur "Rafraîchir session" manuellement',
            duration: 5000,
          })
          return
        }

        const syncResult = await response.json()
        console.log('✅ [AutoSync] Metadata synced:', syncResult)

        console.log('🔄 [AutoSync] Refreshing session...')
        const { error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.error('❌ [AutoSync] Refresh error:', refreshError)
          toast.error('Erreur de rafraîchissement', {
            description: 'Cliquez sur "Rafraîchir session" manuellement',
            duration: 5000,
          })
          return
        }

        console.log('✅ [AutoSync] Session refreshed')
        toast.success('Synchronisation réussie !', {
          description: 'Rechargement de la page...',
          duration: 2000,
        })

        setHasSynced(true)

        setTimeout(() => {
          console.log('🔄 [AutoSync] Reloading page...')
          window.location.reload()
        }, 2000)

      } catch (error: any) {
        console.error('❌ [AutoSync] Error:', error)
      }
    }

    checkAndSyncJWT()
  }, [hasSynced])

  return null
}
