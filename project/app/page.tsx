'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, RefreshCw, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'

interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  cancelledRequests: number
}

interface AccessRequest {
  id: string
  status: string
}

export default function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    cancelledRequests: 0,
  })
  const [allRequests, setAllRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userId = user?.id

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    loadDashboardData()

    const handleDataChange = (payload: any) => {
      console.log('[Dashboard] Data changed:', payload)

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }

      refreshTimeoutRef.current = setTimeout(async () => {
        const previousTotal = stats.totalRequests
        await loadDashboardData(false)

        if (payload.eventType === 'INSERT') {
          toast.success('Nouvelle demande ajoutée', {
            description: 'Votre tableau de bord a été mis à jour'
          })
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Demande mise à jour', {
            description: 'Une de vos demandes a été modifiée'
          })
        } else if (payload.eventType === 'DELETE') {
          toast.info('Demande supprimée', {
            description: 'Une demande a été retirée'
          })
        }
      }, 500)
    }

    const requestsChannel = supabase
      .channel(`home-requests-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'access_requests',
          filter: `user_id=eq.${userId}`
        },
        handleDataChange
      )
      .subscribe((status) => {
        console.log('[Dashboard] Realtime status:', status)
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected')
          console.log('[Dashboard] Realtime connected for user:', userId)
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('disconnected')
          console.error('[Dashboard] Realtime disconnected')
        }
      })

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      supabase.removeChannel(requestsChannel)
    }
  }, [userId])

  const loadDashboardData = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      if (userId) {
        console.log('[Dashboard] Loading data for user:', userId)

        const { data: allRequestsData, error } = await supabase
          .from('access_requests')
          .select('id, status')
          .eq('user_id', userId)

        if (error) {
          console.error('[Dashboard] Error loading requests:', error)
          throw error
        }

        console.log('[Dashboard] Loaded requests:', allRequestsData)

        const requests = allRequestsData || []
        const totalRequests = requests.length
        const pendingRequestsCount = requests.filter((r: any) => r.status === 'pending').length
        const approvedRequestsCount = requests.filter((r: any) => r.status === 'approved').length
        const rejectedRequestsCount = requests.filter((r: any) => r.status === 'rejected').length
        const cancelledRequestsCount = requests.filter((r: any) => r.status === 'cancelled').length

        const newStats = {
          totalRequests,
          pendingRequests: pendingRequestsCount,
          approvedRequests: approvedRequestsCount,
          rejectedRequests: rejectedRequestsCount,
          cancelledRequests: cancelledRequestsCount,
        }

        console.log('[Dashboard] Stats:', newStats)

        setStats(newStats)
        setAllRequests(requests)
      } else {
        console.log('[Dashboard] No user ID available')
        setStats({
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          cancelledRequests: 0,
        })
        setAllRequests([])
      }
    } catch (error) {
      console.error('[Dashboard] Error loading dashboard data:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
          <div className="max-w-3xl mx-auto">
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Connexion requise</CardTitle>
                <CardDescription className="text-lg">
                  Vous devez être connecté(e) pour accéder à votre tableau de bord et voir vos demandes d'accès.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" asChild className="mr-4">
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Créer un compte</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">Tableau de bord</h1>
                {isRefreshing && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                    <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
                    <span className="text-xs text-blue-700 font-medium">Actualisation...</span>
                  </div>
                )}
                {realtimeStatus === 'connected' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-700 font-medium">Temps réel actif</span>
                  </div>
                )}
                {realtimeStatus === 'disconnected' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <span className="text-xs text-red-700 font-medium">Temps réel déconnecté</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mt-2">
                Bienvenue sur la plateforme de réservation des salons d'honneur
              </p>
            </div>
            <Button variant="outline" onClick={() => loadDashboardData()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-lg p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Link href="/my-requests" className="group">
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg p-6 text-white h-full">
                <div className="text-6xl font-bold mb-2">{stats.totalRequests}</div>
                <div className="text-xl font-semibold mb-3">Total demandes</div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Voir toutes mes demandes</span>
                </div>
              </div>
            </Link>

            <Link href="/my-requests" className="group">
              <div className="bg-red-600 hover:bg-red-700 transition-colors rounded-lg p-6 text-white h-full">
                <div className="text-6xl font-bold mb-2">{stats.rejectedRequests}</div>
                <div className="text-xl font-semibold mb-3">Rejetées</div>
                <div className="flex items-center gap-2 text-red-100">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Demandes refusées</span>
                </div>
              </div>
            </Link>

            <Link href="/my-requests" className="group">
              <div className="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-lg p-6 text-white h-full">
                <div className="text-6xl font-bold mb-2">{stats.pendingRequests}</div>
                <div className="text-xl font-semibold mb-3">En attente</div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Demandes en cours</span>
                </div>
              </div>
            </Link>

            <Link href="/my-requests" className="group">
              <div className="bg-green-600 hover:bg-green-700 transition-colors rounded-lg p-6 text-white h-full">
                <div className="text-6xl font-bold mb-2">{stats.approvedRequests}</div>
                <div className="text-xl font-semibold mb-3">Acceptées</div>
                <div className="flex items-center gap-2 text-green-100">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Demandes validées</span>
                </div>
              </div>
            </Link>

            <Link href="/my-requests" className="group">
              <div className="bg-slate-600 hover:bg-slate-700 transition-colors rounded-lg p-6 text-white h-full">
                <div className="text-6xl font-bold mb-2">{stats.cancelledRequests}</div>
                <div className="text-xl font-semibold mb-3">Annulées</div>
                <div className="flex items-center gap-2 text-slate-100">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Demandes annulées</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {!loading && stats.totalRequests === 0 && (
          <Card className="text-center py-12 mb-8">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Aucune demande d'accès</CardTitle>
              <CardDescription className="text-base">
                Vous n'avez pas encore créé de demande d'accès au salon. Commencez par créer votre première demande.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/access-request">Créer ma première demande</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button size="lg" asChild>
            <Link href="/access-request">
              {stats.totalRequests === 0 ? 'Créer ma première demande' : 'Faire une nouvelle demande'}
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
