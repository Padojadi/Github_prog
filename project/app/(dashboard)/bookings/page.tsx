'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { BookingWithDetails } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/currency'
import { BookingQRCode } from '@/components/bookings/booking-qr-code'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        lounge:lounges(*)
      `)
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })

    setBookings(data as BookingWithDetails[] || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Réservations</h1>
          <p className="text-muted-foreground">Voir et gérer vos réservations de salon</p>
        </div>
        <Button asChild>
          <Link href="/lounges">Réserver un salon</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore fait de réservations</p>
            <Button asChild>
              <Link href="/lounges">Parcourir les salons</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{booking.lounge?.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {booking.lounge?.location}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      booking.status === 'confirmed'
                        ? 'default'
                        : booking.status === 'cancelled'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {format(new Date(booking.start_time), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                        {format(new Date(booking.end_time), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">{booking.num_guests} invités</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-semibold">
                      Total : {formatCurrency(booking.total_amount)}
                    </p>
                    {booking.status === 'confirmed' && booking.qr_code_data && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default">
                            <QrCode className="h-4 w-4 mr-2" />
                            Voir le QR Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Votre QR Code de Réservation</DialogTitle>
                            <DialogDescription>
                              Présentez ce QR code à l&apos;entrée du salon {booking.lounge?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <BookingQRCode qrCodeData={booking.qr_code_data} bookingId={booking.id} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  {booking.status === 'confirmed' && !booking.qr_code_data && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Votre QR code sera généré automatiquement.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
