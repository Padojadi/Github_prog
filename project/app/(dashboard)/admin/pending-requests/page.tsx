'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  History
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CorsHelpDialog } from '@/components/admin/cors-help-dialog'
import { RefreshSessionButton } from '@/components/admin/refresh-session-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Companion {
  firstName: string
  lastName: string
  nationality: string
  passportNumber?: string
  relation?: string
}

interface AccessRequest {
  id: string
  start_time: string
  end_time: string
  num_guests: number
  special_requests?: string
  created_at: string
  guest_first_name: string
  guest_last_name: string
  guest_function: string
  guest_phone: string
  guest_organization: string
  guest_nationality: string
  airline?: string
  flight_number?: string
  flight_origin?: string
  flight_arrival_time?: string
  status: 'pending' | 'approved' | 'rejected'
  companion_type?: string
  family_members?: Companion[]
  delegation_members?: Companion[]
  profile: {
    id: string
    full_name: string
    email: string
  }
}

interface Lounge {
  id: string
  name: string
  location: string
}

export default function PendingRequestsPage() {
  const { isAdmin, loading: authLoading, user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AccessRequest[]>([])
  const [lounges, setLounges] = useState<Lounge[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [showCorsHelp, setShowCorsHelp] = useState(false)
  const [notes, setNotes] = useState('')
  const [selectedLoungeId, setSelectedLoungeId] = useState<string>('')
  const [requiresPayment, setRequiresPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>('')
  const [companionStatus, setCompanionStatus] = useState<Map<number, 'approved' | 'rejected'>>(new Map())

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    const ensureJWTMetadata = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.error('❌ No session found')
          return
        }

        const userRole = session.user.app_metadata?.user_role
        console.log('🔍 Current JWT user_role:', userRole)
        console.log('🔍 Full app_metadata:', session.user.app_metadata)

        if (!userRole) {
          console.warn('⚠️ No user_role in JWT, syncing metadata...')
          toast.info('Synchronisation de votre session en cours...')

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
            console.error('❌ Failed to sync metadata:', errorText)
            throw new Error('Failed to sync metadata: ' + errorText)
          }

          const syncResult = await response.json()
          console.log('✅ Metadata synced:', syncResult)

          console.log('🔄 Refreshing session...')
          const { data: refreshData, error } = await supabase.auth.refreshSession()
          if (error) {
            console.error('❌ Refresh error:', error)
            throw error
          }

          console.log('✅ Session refreshed')
          console.log('🔍 New app_metadata:', refreshData.session?.user.app_metadata)

          toast.success('Session mise à jour avec succès')
          console.log('🔄 Reloading page in 500ms...')
          setTimeout(() => window.location.reload(), 500)
        } else {
          console.log('✅ JWT has valid user_role')
        }
      } catch (error) {
        console.error('❌ Error ensuring JWT metadata:', error)
        toast.error('Problème de session. Cliquez sur "Rafraîchir session" ou reconnectez-vous.')
      }
    }

    if (isAdmin) {
      ensureJWTMetadata()
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      loadPendingRequests()
      loadLounges()

      const handleDataChange = () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        refreshTimeoutRef.current = setTimeout(() => {
          loadPendingRequests(false)
        }, 500)
      }

      const requestsChannel = supabase
        .channel('pending-access-requests-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'access_requests' }, handleDataChange)
        .subscribe()

      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        supabase.removeChannel(requestsChannel)
      }
    }
  }, [isAdmin])

  useEffect(() => {
    let filtered = [...requests]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((request) =>
        request.profile.full_name.toLowerCase().includes(query) ||
        request.profile.email.toLowerCase().includes(query) ||
        request.guest_first_name.toLowerCase().includes(query) ||
        request.guest_last_name.toLowerCase().includes(query)
      )
    }

    if (selectedDate) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.start_time)
        return (
          requestDate.getDate() === selectedDate.getDate() &&
          requestDate.getMonth() === selectedDate.getMonth() &&
          requestDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    }

    setFilteredRequests(filtered)
  }, [requests, searchQuery, selectedDate])

  const loadPendingRequests = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔍 Current JWT claims:', session?.user?.app_metadata)
      console.log('🔍 user_role in JWT:', session?.user?.app_metadata?.user_role)

      const { data, error } = await supabase
        .from('access_requests')
        .select(`
          id,
          start_time,
          end_time,
          num_guests,
          special_requests,
          created_at,
          guest_first_name,
          guest_last_name,
          guest_function,
          guest_phone,
          guest_organization,
          guest_nationality,
          airline,
          flight_number,
          flight_origin,
          flight_arrival_time,
          status,
          companion_type,
          family_members,
          delegation_members,
          profile:user_id(id, full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error loading access requests:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('✅ Loaded access requests raw data:', data)
      console.log('✅ Number of access requests:', data?.length || 0)

      const allRequests = (data as any) || []
      const invalidRequests = allRequests.filter((r: any) => !r.profile)

      if (invalidRequests.length > 0) {
        console.warn('⚠️ Some requests have missing profile data:', invalidRequests)
        console.warn('⚠️ This is likely a JWT/RLS issue.')
      }

      const validRequests = allRequests.filter((r: any) => r.profile)
      console.log('✅ Valid requests after filter:', validRequests.length, 'out of', allRequests.length)
      setRequests(validRequests)

      if (allRequests.length > 0 && validRequests.length === 0) {
        toast.error('Impossible de charger les profils. Cliquez sur "Rafraîchir session".')
      }
    } catch (error: any) {
      console.error('❌ Error loading pending requests:', error)

      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('CORS')) {
        setShowCorsHelp(true)
        toast.error('Erreur CORS : Configurez les URLs autorisées dans Supabase', {
          description: 'Cliquez sur le dialogue pour voir les instructions',
          duration: 10000,
        })
        console.error('🔴 CORS ERROR: Please configure allowed URLs in Supabase Dashboard')
        console.error('📖 See GUIDE_CORS_SUPABASE.md for detailed instructions')
        console.error('📖 Current origin:', window.location.origin)
      } else {
        toast.error('Erreur lors du chargement des demandes')
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const loadLounges = async () => {
    try {
      const { data, error } = await supabase
        .from('lounges')
        .select('id, name, location')
        .order('name')

      if (error) throw error
      setLounges(data || [])
    } catch (error) {
      console.error('Error loading lounges:', error)
    }
  }

  const handleOpenDialog = (request: AccessRequest) => {
    setSelectedRequest(request)
    setActionType('approve')
    setNotes('')
    setSelectedLoungeId('')
    setRequiresPayment(false)
    setPaymentAmount('')

    // Par défaut, tous les accompagnants sont approuvés
    const companions = getCompanions(request)
    const initialStatus = new Map<number, 'approved' | 'rejected'>()
    companions.forEach((_, index) => {
      initialStatus.set(index, 'approved')
    })
    setCompanionStatus(initialStatus)

    setShowActionDialog(true)
  }

  const getCompanions = (request: AccessRequest): Companion[] => {
    try {
      if (request.companion_type === 'Famille' && request.family_members) {
        const members = Array.isArray(request.family_members)
          ? request.family_members
          : JSON.parse(request.family_members as any)

        return members.map((m: any) => ({
          firstName: m.firstName || m.prenom || '',
          lastName: m.lastName || m.nom || '',
          nationality: m.nationality || m.nationalite || '',
          passportNumber: m.passportNumber || m.numeroPasSeport || '',
          relation: m.relation || ''
        }))
      }

      if (request.companion_type === 'Délégation' && request.delegation_members) {
        const members = typeof request.delegation_members === 'string'
          ? JSON.parse(request.delegation_members)
          : request.delegation_members

        return members.map((m: any) => ({
          firstName: m.firstName || m.prenom || '',
          lastName: m.lastName || m.nom || '',
          nationality: m.nationality || m.nationalite || '',
          passportNumber: m.passportNumber || m.numeroPasSeport || '',
          relation: m.relation || m.fonction || ''
        }))
      }
    } catch (error) {
      console.error('Error parsing companions:', error)
    }
    return []
  }

  const setCompanionStatusValue = (index: number, status: 'approved' | 'rejected') => {
    setCompanionStatus(prev => {
      const newMap = new Map(prev)
      newMap.set(index, status)
      return newMap
    })
  }

  const confirmAction = async () => {
    if (!selectedRequest || !user) return

    if (actionType === 'approve' && !selectedLoungeId) {
      toast.error('Veuillez sélectionner un salon')
      return
    }

    if (actionType === 'approve' && requiresPayment && !paymentAmount) {
      toast.error('Veuillez saisir le montant à payer')
      return
    }

    if (actionType === 'reject' && !notes.trim()) {
      toast.error('Veuillez indiquer la raison du rejet')
      return
    }

    setActionLoading(selectedRequest.id)
    setShowActionDialog(false)

    try {
      const newStatus: 'approved' | 'rejected' = actionType === 'approve' ? 'approved' : 'rejected'

      let bookingId: string | null = null

      if (actionType === 'approve') {
        const { data: newBooking, error: bookingError } = await (supabase
          .from('bookings') as any)
          .insert({
            user_id: selectedRequest.profile.id,
            lounge_id: selectedLoungeId,
            start_time: selectedRequest.start_time,
            end_time: selectedRequest.end_time,
            num_guests: selectedRequest.num_guests,
            total_amount: requiresPayment ? parseFloat(paymentAmount) : 0,
            status: 'confirmed',
            payment_method: requiresPayment ? 'on_site' : null,
            payment_status: requiresPayment ? 'pending' : null,
            special_requests: selectedRequest.special_requests || null,
            guest_first_name: selectedRequest.guest_first_name,
            guest_last_name: selectedRequest.guest_last_name,
            guest_function: selectedRequest.guest_function,
            guest_phone: selectedRequest.guest_phone,
            guest_organization: selectedRequest.guest_organization,
            guest_nationality: selectedRequest.guest_nationality,
            airline: selectedRequest.airline || null,
            flight_number: selectedRequest.flight_number || null,
            flight_origin: selectedRequest.flight_origin || null,
            flight_arrival_time: selectedRequest.flight_arrival_time || null,
          })
          .select('id')
          .single()

        if (bookingError) throw bookingError
        bookingId = newBooking.id
      }

      const companions = getCompanions(selectedRequest)
      const approvedCompanionsList = companions
        .map((companion, index) => ({
          ...companion,
          status: companionStatus.get(index) || 'approved'
        }))
        .filter(c => c.status === 'approved')
        .map(({ status, ...companion }) => companion)

      const rejectedCompanionsList = companions
        .map((companion, index) => ({
          ...companion,
          status: companionStatus.get(index) || 'approved'
        }))
        .filter(c => c.status === 'rejected')
        .map(({ status, ...companion }) => companion)

      const { error: updateError } = await (supabase
        .from('access_requests') as any)
        .update({
          status: newStatus,
          admin_notes: notes || null,
          processed_by: user.id,
          processed_at: new Date().toISOString(),
          booking_id: bookingId,
          approved_companions: actionType === 'approve' ? approvedCompanionsList : null,
          rejected_companions: actionType === 'approve' ? rejectedCompanionsList : null,
          approved_lounge_id: actionType === 'approve' ? selectedLoungeId : null,
        })
        .eq('id', selectedRequest.id)

      if (updateError) throw updateError

      toast.success(
        actionType === 'approve'
          ? 'Demande d\'accès approuvée avec succès'
          : 'Demande d\'accès rejetée'
      )

      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
      await loadPendingRequests(false)
    } catch (error) {
      console.error('Error processing access request:', error)
      toast.error('Erreur lors du traitement de la demande')
    } finally {
      setActionLoading(null)
      setSelectedRequest(null)
      setNotes('')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedDate(undefined)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Chargement des demandes en attente...</p>
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
            <h1 className="text-3xl font-bold">Demandes en attente</h1>
            {isRefreshing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
                <span className="text-xs text-blue-700 font-medium">Actualisation...</span>
              </div>
            )}
            {requests.length > 0 && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                {requests.length} {requests.length === 1 ? 'demande' : 'demandes'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            Gérez les demandes de réservation en attente de validation
          </p>
        </div>
        <div className="flex gap-2">
          <RefreshSessionButton />
          <Button variant="outline" onClick={() => router.push('/admin/test-cors')}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Test CORS
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/booking-history')}>
            <History className="h-4 w-4 mr-2" />
            Historique
          </Button>
          <Button variant="outline" onClick={() => loadPendingRequests()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {showCorsHelp && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900 dark:text-red-100">Erreur CORS Détectée</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowCorsHelp(false)}>
                Masquer
              </Button>
            </div>
            <CardDescription className="text-red-700 dark:text-red-300">
              Votre projet Supabase bloque les requêtes depuis cette origine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              Pour résoudre ce problème, vous devez configurer les URLs autorisées dans votre Dashboard Supabase.
            </p>
            <div className="bg-white dark:bg-gray-900 p-3 rounded border border-red-200 dark:border-red-700">
              <p className="text-xs font-semibold mb-1 text-red-900 dark:text-red-100">Origine actuelle à autoriser :</p>
              <code className="text-xs break-all text-red-800 dark:text-red-200">
                {typeof window !== 'undefined' ? window.location.origin : ''}
              </code>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCorsHelp(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Voir les instructions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/test-cors')}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Diagnostic
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                Ouvrir Supabase Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtres et recherche</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, prénom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'dd MMM yyyy', { locale: fr })
                    ) : (
                      <span>Toutes les dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>

          {filteredRequests.length < requests.length && (
            <div className="mt-4 text-sm text-muted-foreground">
              Affichage de {filteredRequests.length} sur {requests.length} demandes
            </div>
          )}
        </CardContent>
      </Card>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune demande d'accès en attente</p>
          </CardContent>
        </Card>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune demande ne correspond aux filtres sélectionnés</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>
                          {request.guest_first_name} {request.guest_last_name}
                        </CardTitle>
                        <Badge variant="secondary">En attente</Badge>
                      </div>
                      <CardDescription>
                        {request.guest_function} - {request.guest_organization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-medium">{request.guest_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nationalité</p>
                      <p className="text-sm font-medium">{request.guest_nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Demandeur</p>
                      <p className="text-sm font-medium">{request.profile.full_name}</p>
                    </div>
                  </div>

                  {(request.airline || request.flight_number) && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Informations de vol</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        {request.airline && (
                          <div>
                            <p className="text-xs text-muted-foreground">Compagnie</p>
                            <p className="text-sm font-medium">{request.airline}</p>
                          </div>
                        )}
                        {request.flight_number && (
                          <div>
                            <p className="text-xs text-muted-foreground">Vol</p>
                            <p className="text-sm font-medium">{request.flight_number}</p>
                          </div>
                        )}
                        {request.flight_origin && (
                          <div>
                            <p className="text-xs text-muted-foreground">Provenance</p>
                            <p className="text-sm font-medium">{request.flight_origin}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {format(new Date(request.start_time), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Horaire</p>
                          <p className="font-medium">
                            {format(new Date(request.start_time), 'HH:mm')} - {format(new Date(request.end_time), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Accompagnants</p>
                          <p className="font-medium">{request.num_guests} {request.num_guests > 1 ? 'personnes' : 'personne'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.special_requests && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-1">Remarques</p>
                      <p className="text-sm text-muted-foreground">{request.special_requests}</p>
                    </div>
                  )}

                  {getCompanions(request).length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">
                        Accompagnants ({getCompanions(request).length})
                      </p>
                      <div className="space-y-2">
                        {getCompanions(request).map((companion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 bg-muted/50 rounded text-sm"
                          >
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium">
                                {companion.firstName} {companion.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {companion.nationality}
                                {companion.passportNumber && ` • ${companion.passportNumber}`}
                                {companion.relation && ` • ${companion.relation}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Button
                      onClick={() => handleOpenDialog(request)}
                      disabled={actionLoading === request.id}
                      className="w-full"
                    >
                      Traiter la demande
                    </Button>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Traiter la demande d'accès</DialogTitle>
            <DialogDescription>
              Sélectionnez une action et remplissez les informations nécessaires
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedRequest.guest_first_name} {selectedRequest.guest_last_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(selectedRequest.start_time), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedRequest.guest_function} - {selectedRequest.guest_organization}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action *</Label>
                <Select value={actionType} onValueChange={(value: 'approve' | 'reject') => setActionType(value)}>
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Sélectionner une action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Accepter</SelectItem>
                    <SelectItem value="reject">Rejeter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionType === 'approve' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="lounge">Salon à assigner *</Label>
                    <Select value={selectedLoungeId} onValueChange={setSelectedLoungeId}>
                      <SelectTrigger id="lounge">
                        <SelectValue placeholder="Sélectionner un salon" />
                      </SelectTrigger>
                      <SelectContent>
                        {lounges.map((lounge) => (
                          <SelectItem key={lounge.id} value={lounge.id}>
                            {lounge.name} - {lounge.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {getCompanions(selectedRequest).length > 0 && (
                    <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Accompagnants ({getCompanions(selectedRequest).length})
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const companions = getCompanions(selectedRequest)
                              const newStatus = new Map<number, 'approved' | 'rejected'>()
                              companions.forEach((_, i) => newStatus.set(i, 'approved'))
                              setCompanionStatus(newStatus)
                            }}
                          >
                            Tout approuver
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const companions = getCompanions(selectedRequest)
                              const newStatus = new Map<number, 'approved' | 'rejected'>()
                              companions.forEach((_, i) => newStatus.set(i, 'rejected'))
                              setCompanionStatus(newStatus)
                            }}
                          >
                            Tout refuser
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {getCompanions(selectedRequest).map((companion, index) => {
                          const status = companionStatus.get(index) || 'approved'
                          return (
                            <div
                              key={index}
                              className={cn(
                                "p-3 bg-background rounded border-2",
                                status === 'approved' && "border-green-500/50 bg-green-50/50",
                                status === 'rejected' && "border-red-500/50 bg-red-50/50"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-1">
                                  <div className="text-sm font-medium">
                                    {companion.firstName} {companion.lastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p>Nationalité: {companion.nationality}</p>
                                    {companion.passportNumber && (
                                      <p>Passeport: {companion.passportNumber}</p>
                                    )}
                                    {companion.relation && (
                                      <p>Relation: {companion.relation}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={status === 'approved' ? 'default' : 'outline'}
                                    onClick={() => setCompanionStatusValue(index, 'approved')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={status === 'rejected' ? 'destructive' : 'outline'}
                                    onClick={() => setCompanionStatusValue(index, 'rejected')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Array.from(companionStatus.values()).filter(s => s === 'approved').length} approuvé(s), {Array.from(companionStatus.values()).filter(s => s === 'rejected').length} refusé(s)
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment"
                      checked={requiresPayment}
                      onCheckedChange={(checked) => setRequiresPayment(checked as boolean)}
                    />
                    <Label htmlFor="payment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Doit payer
                    </Label>
                  </div>

                  {requiresPayment && (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Montant (XOF) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Entrez le montant en XOF"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="0"
                        step="1000"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Note (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ajoutez une note pour le demandeur..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {actionType === 'reject' && (
                <div className="space-y-2">
                  <Label htmlFor="notes">Raison du rejet *</Label>
                  <Textarea
                    id="notes"
                    placeholder="Expliquez pourquoi la demande est rejetée..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActionDialog(false)
                setSelectedRequest(null)
                setNotes('')
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmAction}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {actionType === 'approve' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CorsHelpDialog open={showCorsHelp} onOpenChange={setShowCorsHelp} />
    </div>
  )
}
