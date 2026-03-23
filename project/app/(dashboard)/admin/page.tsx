'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentBookings } from '@/components/admin/recent-bookings'
import { RecentLounges } from '@/components/admin/recent-lounges'
import { BookingChart } from '@/components/admin/booking-chart'
import { RevenueOverview } from '@/components/admin/revenue-overview'
import { RefreshSessionButton } from '@/components/admin/refresh-session-button'
import { PendingAccessRequests } from '@/components/admin/pending-access-requests'
import { ApprovedAccessRequests } from '@/components/admin/approved-access-requests'
import { RefreshCw } from 'lucide-react'

interface DashboardData {
  stats: {
    totalLounges: number
    activeLounges: number
    maintenanceLounges: number
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    completedBookings: number
    cancelledBookings: number
    totalRevenue: number
    todayRevenue: number
    totalUsers: number
    newUsersToday: number
    totalAccessRequests: number
    pendingAccessRequests: number
    approvedAccessRequests: number
    rejectedAccessRequests: number
  }
  recentBookings: any[]
  recentLounges: any[]
  pendingAccessRequests: any[]
  approvedAccessRequests: any[]
}

export default function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalLounges: 0,
      activeLounges: 0,
      maintenanceLounges: 0,
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      totalUsers: 0,
      newUsersToday: 0,
      totalAccessRequests: 0,
      pendingAccessRequests: 0,
      approvedAccessRequests: 0,
      rejectedAccessRequests: 0,
    },
    recentBookings: [],
    recentLounges: [],
    pendingAccessRequests: [],
    approvedAccessRequests: [],
  })
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/lounges')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    const ensureJWTMetadata = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const userRole = session.user.app_metadata?.user_role
        if (!userRole) {
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

          if (response.ok) {
            await supabase.auth.refreshSession()
            setTimeout(() => window.location.reload(), 500)
          }
        }
      } catch (error) {
        console.error('Error syncing metadata:', error)
      }
    }

    if (isAdmin) {
      ensureJWTMetadata()
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData()

      const handleDataChange = () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        refreshTimeoutRef.current = setTimeout(() => {
          loadDashboardData(false)
        }, 500)
      }

      const loungesChannel = supabase
        .channel('lounges-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lounges' }, handleDataChange)
        .subscribe()

      const bookingsChannel = supabase
        .channel('bookings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, handleDataChange)
        .subscribe()

      const profilesChannel = supabase
        .channel('profiles-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, handleDataChange)
        .subscribe()

      const accessRequestsChannel = supabase
        .channel('access-requests-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'access_requests' }, handleDataChange)
        .subscribe()

      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        supabase.removeChannel(loungesChannel)
        supabase.removeChannel(bookingsChannel)
        supabase.removeChannel(profilesChannel)
        supabase.removeChannel(accessRequestsChannel)
      }
    }
  }, [isAdmin])

  const loadDashboardData = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()

      const [
        loungesResult,
        bookingsResult,
        usersResult,
        accessRequestsResult,
        recentBookingsResult,
        recentLoungesResult,
        pendingAccessRequestsResult,
        approvedAccessRequestsResult
      ] = await Promise.all([
        supabase.from('lounges').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('access_requests').select('id, status'),
        supabase
          .from('bookings')
          .select(`
            id,
            status,
            start_time,
            end_time,
            total_amount,
            lounge:lounges(name),
            profile:user_id(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('lounges')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('access_requests')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('access_requests')
          .select(`
            *,
            lounge:lounge_id(name)
          `)
          .eq('status', 'approved')
          .order('processed_at', { ascending: false })
          .limit(5),
      ])

      const lounges = loungesResult.data || []
      const bookings = bookingsResult.data || []
      const users = usersResult.data || []
      const accessRequests = accessRequestsResult.data || []

      const todayBookings = bookings.filter((b: any) => new Date(b.created_at) >= today)
      const todayUsers = users.filter((u: any) => new Date(u.created_at) >= today)

      setData({
        stats: {
          totalLounges: lounges.length,
          activeLounges: lounges.filter((l: any) => l.status === 'active').length,
          maintenanceLounges: lounges.filter((l: any) => l.status === 'maintenance').length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          confirmedBookings: bookings.filter((b: any) => b.status === 'confirmed').length,
          completedBookings: bookings.filter((b: any) => b.status === 'completed').length,
          cancelledBookings: bookings.filter((b: any) => b.status === 'cancelled').length,
          totalRevenue: bookings.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0),
          todayRevenue: todayBookings.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0),
          totalUsers: users.length,
          newUsersToday: todayUsers.length,
          totalAccessRequests: accessRequests.length,
          pendingAccessRequests: accessRequests.filter((r: any) => r.status === 'pending').length,
          approvedAccessRequests: accessRequests.filter((r: any) => r.status === 'approved').length,
          rejectedAccessRequests: accessRequests.filter((r: any) => r.status === 'rejected').length,
        },
        recentBookings: recentBookingsResult.data || [],
        recentLounges: recentLoungesResult.data || [],
        pendingAccessRequests: pendingAccessRequestsResult.data || [],
        approvedAccessRequests: approvedAccessRequestsResult.data || [],
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Tableau de Bord Admin</h1>
            {isRefreshing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
                <span className="text-xs text-blue-700 font-medium">Actualisation...</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-2">Vue d'ensemble et statistiques en temps réel</p>
        </div>
        <div className="flex gap-2">
          <RefreshSessionButton />
          <Button variant="outline" onClick={() => loadDashboardData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button asChild>
            <Link href="/admin/lounges/new">Ajouter un salon</Link>
          </Button>
        </div>
      </div>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <BookingChart
          data={{
            pending: data.stats.pendingBookings,
            confirmed: data.stats.confirmedBookings,
            completed: data.stats.completedBookings,
            cancelled: data.stats.cancelledBookings,
          }}
        />
        <RevenueOverview
          totalRevenue={data.stats.totalRevenue}
          todayRevenue={data.stats.todayRevenue}
          totalBookings={data.stats.totalBookings}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentBookings bookings={data.recentBookings} />
        <RecentLounges lounges={data.recentLounges} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PendingAccessRequests requests={data.pendingAccessRequests} />
        <ApprovedAccessRequests requests={data.approvedAccessRequests} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Salons</CardTitle>
            <CardDescription>Gérez vos salons d'honneur et leur disponibilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/lounges">Voir tous les salons</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/lounges/new">Créer un nouveau salon</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestion des Réservations</CardTitle>
            <CardDescription>Suivez et gérez toutes les réservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/bookings">Toutes les réservations</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/users">Gérer les utilisateurs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
