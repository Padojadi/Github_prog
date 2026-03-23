'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface Lounge {
  id: string
  name: string
  status: string
  capacity: number
  hourly_rate: number | null
  location: string
  created_at: string
}

interface RecentLoungesProps {
  lounges: Lounge[]
}

export function RecentLounges({ lounges }: RecentLoungesProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Maintenance</Badge>
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactif</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salons Récemment Créés</CardTitle>
        <CardDescription>Les derniers salons ajoutés au système</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lounges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun salon récent
            </p>
          ) : (
            lounges.map((lounge) => (
              <div key={lounge.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lounge.name}</p>
                    {getStatusBadge(lounge.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lounge.location} • Capacité: {lounge.capacity} personnes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Créé le {format(new Date(lounge.created_at), 'PPP', { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {lounge.hourly_rate && (
                    <div className="text-right">
                      <p className="font-bold">{lounge.hourly_rate.toFixed(2)}$/h</p>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/lounges/${lounge.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
