'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export function SyncMetadataButton() {
  const [syncing, setSyncing] = useState(false)

  async function syncMetadata() {
    setSyncing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-user-metadata`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la synchronisation')
      }

      const result = await response.json()
      toast.success(`Synchronisation réussie: ${result.updated} utilisateurs mis à jour`)

      if (result.failed > 0) {
        toast.warning(`${result.failed} erreurs lors de la synchronisation`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la synchronisation')
      console.error(error)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={syncMetadata}
      disabled={syncing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Synchronisation...' : 'Synchroniser les métadonnées'}
    </Button>
  )
}
