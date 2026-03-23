'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DiagnosticPage() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [jwtInfo, setJwtInfo] = useState<any>(null)
  const [dbRequests, setDbRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      loadDiagnosticInfo()
    }
  }, [isAdmin])

  const loadDiagnosticInfo = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setJwtInfo({
          user_role: session.user.app_metadata?.user_role,
          role: session.user.app_metadata?.role,
          email: session.user.email,
          full_metadata: session.user.app_metadata
        })
      }

      const { data: requests, error } = await supabase
        .from('access_requests')
        .select(`
          id,
          guest_first_name,
          guest_last_name,
          status,
          created_at,
          start_time,
          profile:user_id(email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading requests:', error)
        toast.error('Erreur lors du chargement: ' + error.message)
      } else {
        setDbRequests(requests || [])
      }
    } catch (error: any) {
      console.error('Error in diagnostic:', error)
      toast.error('Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Aucune session active')
        return
      }

      console.log('🔄 Syncing metadata...')
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
        throw new Error('Failed to sync: ' + errorText)
      }

      const syncResult = await response.json()
      console.log('✅ Synced:', syncResult)

      console.log('🔄 Refreshing session...')
      await supabase.auth.refreshSession()

      toast.success('JWT synchronisé ! Rechargement...', {
        description: 'Vos permissions ont été mises à jour'
      })

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error('Sync error:', error)
      toast.error('Erreur de synchronisation: ' + error.message)
    } finally {
      setSyncing(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Chargement du diagnostic...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const jwtIsValid = jwtInfo?.user_role === 'administrator'
  const profileIsAdmin = profile?.role === 'administrator'
  const isSynced = jwtIsValid && profileIsAdmin

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Diagnostic Administrateur
        </h1>
        <p className="text-muted-foreground mt-2">
          Vérifiez l'état de votre JWT et l'accès aux demandes
        </p>
      </div>

      <Card className={isSynced ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSynced ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <CardTitle>État du JWT</CardTitle>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncing}
              variant={isSynced ? 'outline' : 'default'}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronisation...' : 'Forcer la synchronisation'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-2">Profile dans la base de données</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <span className="text-sm font-mono">{profile?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rôle:</span>
                  <Badge variant={profileIsAdmin ? 'default' : 'secondary'}>
                    {profile?.role || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">JWT (app_metadata)</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <span className="text-sm font-mono">{jwtInfo?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">user_role:</span>
                  <Badge variant={jwtIsValid ? 'default' : 'destructive'}>
                    {jwtInfo?.user_role || 'MANQUANT'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Status de synchronisation</p>
            {isSynced ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">JWT correctement synchronisé avec la base de données</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  JWT non synchronisé. Cliquez sur &quot;Forcer la synchronisation&quot; pour corriger.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Demandes d'accès en attente</CardTitle>
              <CardDescription>
                {dbRequests.length} {dbRequests.length === 1 ? 'demande trouvée' : 'demandes trouvées'} dans la base de données
              </CardDescription>
            </div>
            <Button onClick={loadDiagnosticInfo} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dbRequests.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune demande en attente dans la base de données</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dbRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {request.guest_first_name} {request.guest_last_name}
                      </p>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Demandeur: {request.profile?.full_name || 'N/A'} ({request.profile?.email || 'N/A'})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Créée le: {new Date(request.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    {request.profile?.email === 'maisonthiaroye@gmail.com' && (
                      <Badge variant="default" className="bg-blue-600">
                        maisonthiaroye@gmail.com
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {dbRequests.length > 0 && !isSynced && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Vous voyez {dbRequests.length} demandes ici, mais elles peuvent ne pas apparaître dans &quot;Demandes en attente&quot;
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cliquez sur &quot;Forcer la synchronisation&quot; en haut pour corriger votre JWT et pouvoir traiter ces demandes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {dbRequests.length > 0 && isSynced && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Votre JWT est synchronisé. Ces demandes devraient être visibles dans &quot;Demandes en attente&quot;
                  </p>
                  <Button
                    onClick={() => router.push('/admin/pending-requests')}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Aller aux demandes en attente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations techniques</CardTitle>
          <CardDescription>Pour le débogage avancé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">JWT app_metadata complet</p>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(jwtInfo?.full_metadata || {}, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Actions disponibles</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    console.log('JWT Info:', jwtInfo)
                    console.log('Profile:', profile)
                    console.log('Requests:', dbRequests)
                    toast.success('Informations affichées dans la console')
                  }}
                  variant="outline"
                  size="sm"
                >
                  Afficher dans la console
                </Button>
                <Button
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  size="sm"
                >
                  Retour au dashboard
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
