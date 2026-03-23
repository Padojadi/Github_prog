'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils/currency'

interface Booking {
  id: string
  status: string
  start_time: string
  end_time: string
  total_amount: number
  lounge: {
    name: string
  }
  profile: {
    full_name: string
    email: string
  }
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En attente</Badge>
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmée</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terminée</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réservations Récentes</CardTitle>
        <CardDescription>Les dernières réservations effectuées</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune réservation récente
            </p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{booking.lounge.name}</p>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.profile.full_name || booking.profile.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.start_time), 'PPP à HH:mm', { locale: fr })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(booking.total_amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
