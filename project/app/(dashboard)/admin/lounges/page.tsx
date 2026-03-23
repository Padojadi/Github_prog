'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Lounge } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Users, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'

export default function AdminLoungesPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [lounges, setLounges] = useState<Lounge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/lounges')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      loadLounges()
    }
  }, [isAdmin])

  const loadLounges = async () => {
    const { data } = await supabase
      .from('lounges')
      .select('*')
      .order('name')

    setLounges(data || [])
    setLoading(false)
  }

  if (authLoading || loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gérer les Salons</h1>
          <p className="text-muted-foreground">Ajouter, modifier et gérer vos salons d'honneur</p>
        </div>
        <Button asChild>
          <Link href="/admin/lounges/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un salon
          </Link>
        </Button>
      </div>

      {lounges.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">Aucun salon créé pour le moment</p>
            <Button asChild>
              <Link href="/admin/lounges/new">Ajouter votre premier salon</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lounges.map((lounge) => (
            <Card key={lounge.id} className="overflow-hidden">
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
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{lounge.name}</h3>
                  <Badge variant={lounge.status === 'active' ? 'default' : 'secondary'}>
                    {lounge.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" />
                  {lounge.location}
                </p>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{lounge.capacity}</span>
                  </div>
                  {lounge.hourly_rate && (
                    <div className="flex items-center gap-1">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      <span>{formatCurrency(lounge.hourly_rate)}/h</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/admin/lounges/${lounge.id}`}>Gérer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
