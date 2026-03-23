import Link from 'next/link'
import { Lounge } from '@/lib/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'

interface LoungeCardProps {
  lounge: Lounge
}

export function LoungeCard({ lounge }: LoungeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {lounge.image_url ? (
          <img
            src={lounge.image_url}
            alt={lounge.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
            {lounge.name.charAt(0)}
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{lounge.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {lounge.location}
            </CardDescription>
          </div>
          <Badge variant={lounge.status === 'active' ? 'default' : 'secondary'}>
            {lounge.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {lounge.description || 'Aucune description disponible'}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Jusqu'à {lounge.capacity} invités</span>
          </div>
          {lounge.hourly_rate && (
            <div className="font-semibold text-lg">
              {formatCurrency(lounge.hourly_rate)}/h
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/lounges/${lounge.id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
