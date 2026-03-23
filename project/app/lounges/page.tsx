'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Lounge } from '@/lib/types'
import { LoungeCard } from '@/components/lounges/lounge-card'
import { MainLayout } from '@/components/layout/main-layout'

export default function LoungesPage() {
  const [lounges, setLounges] = useState<Lounge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLounges() {
      try {
        const { data } = await supabase
          .from('lounges')
          .select('*')
          .eq('status', 'active')
          .order('name')

        setLounges((data || []) as Lounge[])
      } catch (error) {
        console.error('Error fetching lounges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLounges()
  }, [])

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Parcourir les salons d'honneur</h1>
          <p className="text-muted-foreground">
            Choisissez parmi notre sélection d'espaces premium
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : lounges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun salon disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lounges.map((lounge) => (
              <LoungeCard key={lounge.id} lounge={lounge} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
