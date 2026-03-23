'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BookingWithHistory {
  id: string
  start_time: string
  end_time: string
  num_guests: number
  total_amount: number
  status: string
  admin_notes?: string
  processed_at?: string
  created_at: string
  lounge: {
    id: string
    name: string
    location: string
  }
  profile: {
    id: string
    full_name: string
    email: string
  }
  processed_by_profile?: {
    id: string
    full_name: string
  }
  history: {
    id: string
    action: string
    old_status: string
    new_status: string
    notes?: string
    created_at: string
    processed_by_profile?: {
      full_name: string
    }
  }[]
}

interface Lounge {
  id: string
  name: string
  location: string
}

export default function BookingHistoryPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingWithHistory[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingWithHistory[]>([])
  const [lounges, setLounges] = useState<Lounge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithHistory | null>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLounge, setSelectedLounge] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      loadBookingHistory()
      loadLounges()
    }
  }, [isAdmin])

  useEffect(() => {
    let filtered = [...bookings]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((booking) =>
        booking.profile.full_name.toLowerCase().includes(query) ||
        booking.profile.email.toLowerCase().includes(query)
      )
    }

    if (selectedLounge !== 'all') {
      filtered = filtered.filter((booking) => booking.lounge.id === selectedLounge)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((booking) => booking.status === selectedStatus)
    }

    if (selectedDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.start_time)
        return (
          bookingDate.getDate() === selectedDate.getDate() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    }

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, selectedLounge, selectedStatus, selectedDate])

  const loadBookingHistory = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          num_guests,
          total_amount,
          status,
          admin_notes,
          processed_at,
          created_at,
          lounge:lounges(id, name, location),
          profile:profiles!bookings_user_id_fkey(id, full_name, email),
          processed_by_profile:profiles!bookings_processed_by_fkey(id, full_name)
        `)
        .neq('status', 'pending')
        .order('processed_at', { ascending: false, nullsFirst: false })

      if (error) throw error
      setBookings((data as any) || [])
    } catch (error) {
      console.error('Error loading booking history:', error)
      toast.error('Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
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

  const loadBookingHistoryDetails = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('booking_history')
        .select(`
          id,
          action,
          old_status,
          new_status,
          notes,
          created_at,
          processed_by_profile:processed_by(full_name)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const booking = bookings.find(b => b.id === bookingId)
      if (booking) {
        setSelectedBooking({ ...booking, history: data as any || [] })
        setShowHistoryDialog(true)
      }
    } catch (error) {
      console.error('Error loading booking history details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedLounge('all')
    setSelectedStatus('all')
    setSelectedDate(undefined)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmé</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Rejeté</Badge>
      case 'completed':
        return <Badge className="bg-blue-500">Complété</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Chargement de l'historique...</p>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/pending-requests')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Historique des décisions</h1>
            {bookings.length > 0 && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                {bookings.length} {bookings.length === 1 ? 'décision' : 'décisions'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2 ml-14">
            Consultez l'historique complet de toutes les décisions prises
          </p>
        </div>
        <Button variant="outline" onClick={loadBookingHistory}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtres et recherche</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher un demandeur</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lounge">Salon</Label>
              <Select value={selectedLounge} onValueChange={setSelectedLounge}>
                <SelectTrigger id="lounge">
                  <SelectValue placeholder="Tous les salons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les salons</SelectItem>
                  {lounges.map((lounge) => (
                    <SelectItem key={lounge.id} value={lounge.id}>
                      {lounge.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Rejeté</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de réservation</Label>
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

          {filteredBookings.length < bookings.length && (
            <div className="mt-4 text-sm text-muted-foreground">
              Affichage de {filteredBookings.length} sur {bookings.length} décisions
            </div>
          )}
        </CardContent>
      </Card>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune décision dans l'historique</p>
          </CardContent>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune décision ne correspond aux filtres sélectionnés</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{booking.lounge.name}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {booking.lounge.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(new Date(booking.start_time), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Horaire</p>
                      <p className="font-medium">
                        {format(new Date(booking.start_time), 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Invités</p>
                      <p className="font-medium">{booking.num_guests} personnes</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Montant</p>
                    <p className="font-semibold text-lg">{booking.total_amount}$</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Demandeur</p>
                      <p className="text-sm text-muted-foreground">{booking.profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{booking.profile.email}</p>
                    </div>
                    {booking.processed_by_profile && (
                      <div>
                        <p className="text-sm font-medium mb-1">Traité par</p>
                        <p className="text-sm text-muted-foreground">{booking.processed_by_profile.full_name}</p>
                        {booking.processed_at && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.processed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {booking.admin_notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{booking.admin_notes}</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadBookingHistoryDetails(booking.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir l'historique complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Historique complet</DialogTitle>
            <DialogDescription>
              Toutes les actions effectuées sur cette réservation
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedBooking.lounge.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(selectedBooking.start_time), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedBooking.profile.full_name} - {selectedBooking.num_guests} invités
                </div>
              </div>

              <div className="space-y-3">
                {selectedBooking.history && selectedBooking.history.length > 0 ? (
                  selectedBooking.history.map((entry) => (
                    <div key={entry.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="mt-1">{getActionIcon(entry.action)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{entry.action}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.old_status} → {entry.new_status}
                        </div>
                        {entry.processed_by_profile && (
                          <div className="text-xs text-muted-foreground">
                            Par: {entry.processed_by_profile.full_name}
                          </div>
                        )}
                        {entry.notes && (
                          <div className="text-sm mt-2 p-2 bg-muted rounded">
                            {entry.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucun historique disponible
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
