'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface RevenueOverviewProps {
  totalRevenue: number
  todayRevenue: number
  totalBookings: number
}

export function RevenueOverview({ totalRevenue, todayRevenue, totalBookings }: RevenueOverviewProps) {
  const averagePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0
  const todayPercentage = totalRevenue > 0 ? (todayRevenue / totalRevenue) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu des Revenus</CardTitle>
        <CardDescription>Analyse financière détaillée</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">Revenu Total</p>
              <p className="text-2xl font-bold text-green-900">{totalRevenue.toFixed(2)}$</p>
              <p className="text-xs text-green-600 mt-1">Toutes les réservations</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-700 font-medium">Revenu Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-900">{todayRevenue.toFixed(2)}$</p>
              <p className="text-xs text-blue-600 mt-1">
                {todayPercentage.toFixed(1)}% du total
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-700 font-medium">Moyenne par Réservation</p>
              <p className="text-2xl font-bold text-amber-900">{averagePerBooking.toFixed(2)}$</p>
              <p className="text-xs text-amber-600 mt-1">
                Basé sur {totalBookings} réservation{totalBookings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
