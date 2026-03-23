'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function RefreshSessionButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      console.log('🔄 Starting session refresh...')

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Aucune session active')
        setIsRefreshing(false)
        return
      }

      console.log('📋 Current JWT app_metadata:', session.user.app_metadata)
      const currentUserRole = session.user.app_metadata?.user_role
      console.log('🔍 Current user_role in JWT:', currentUserRole)

      // Toujours synchroniser les métadonnées pour s'assurer qu'elles sont à jour
      console.log('📡 Syncing metadata from database...')
      toast.info('Synchronisation des données...')

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
        console.error('❌ Sync failed:', errorText)
        throw new Error('Failed to sync metadata: ' + errorText)
      }

      const syncResult = await response.json()
      console.log('✅ Metadata synced:', syncResult)
      console.log('🔑 New user_role should be:', syncResult.user_role)

      // Forcer le rafraîchissement de la session pour obtenir un nouveau JWT
      console.log('🔄 Refreshing session to get new JWT...')
      toast.info('Récupération du nouveau JWT...')

      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

      if (refreshError) {
        console.error('❌ Refresh error:', refreshError)
        throw refreshError
      }

      console.log('✅ Session refreshed successfully')
      console.log('🔑 New JWT app_metadata:', refreshData.session?.user.app_metadata)
      console.log('🔍 New user_role:', refreshData.session?.user.app_metadata?.user_role)

      toast.success('Session mise à jour ! Rechargement...', {
        description: 'Vos permissions ont été actualisées'
      })

      // Attendre un peu pour que le toast soit visible avant de recharger
      console.log('🔄 Reloading page in 1 second...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error('❌ Error refreshing session:', error)
      toast.error('Erreur lors du rafraîchissement', {
        description: error.message || 'Veuillez réessayer ou vous reconnecter'
      })
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir session'}
    </Button>
  )
}
