'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Lounge } from '@/lib/types'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Users, MapPin, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'

export default function LoungeDetailPage() {
  const params = useParams()
  const [lounge, setLounge] = useState<Lounge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLounge() {
      try {
        const { data } = await supabase
          .from('lounges')
          .select('*')
          .eq('id', params.id)
          .maybeSingle()

        setLounge(data as Lounge | null)
      } catch (error) {
        console.error('Error fetching lounge:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLounge()
    }
  }, [params.id])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!lounge) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Salon non trouvé</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const amenitiesList = Array.isArray(lounge.amenities) ? lounge.amenities : []

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
              {lounge.image_url ? (
                <img
                  src={lounge.image_url}
                  alt={lounge.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-400">
                  {lounge.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{lounge.name}</h1>
                <Badge variant={lounge.status === 'active' ? 'default' : 'secondary'}>
                  {lounge.status}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {lounge.location}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Capacité</p>
                      <p className="font-semibold">Jusqu'à {lounge.capacity} invités</p>
                    </div>
                  </div>
                  {lounge.hourly_rate && (
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tarif horaire</p>
                        <p className="font-semibold">{formatCurrency(lounge.hourly_rate)}/heure</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-3">À propos</h2>
              <p className="text-muted-foreground">
                {lounge.description || 'Aucune description disponible pour ce salon.'}
              </p>
            </div>

            {amenitiesList.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Équipements</h2>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      {typeof amenity === 'string' ? amenity : amenity.name || 'Équipement'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {lounge.status === 'active' && (
              <Button size="lg" className="w-full" asChild>
                <Link href={`/bookings/new?loungeId=${lounge.id}`}>
                  Réserver ce salon
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
