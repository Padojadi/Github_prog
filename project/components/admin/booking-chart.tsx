'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingChartProps {
  data: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
}

export function BookingChart({ data }: BookingChartProps) {
  const total = data.pending + data.confirmed + data.completed + data.cancelled
  const maxValue = Math.max(data.pending, data.confirmed, data.completed, data.cancelled, 1)

  const chartData = [
    { label: 'En attente', value: data.pending, color: 'bg-amber-500', percentage: total > 0 ? (data.pending / total) * 100 : 0 },
    { label: 'Confirmées', value: data.confirmed, color: 'bg-green-500', percentage: total > 0 ? (data.confirmed / total) * 100 : 0 },
    { label: 'Terminées', value: data.completed, color: 'bg-blue-500', percentage: total > 0 ? (data.completed / total) * 100 : 0 },
    { label: 'Annulées', value: data.cancelled, color: 'bg-red-500', percentage: total > 0 ? (data.cancelled / total) * 100 : 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Réservations</CardTitle>
        <CardDescription>Distribution par statut</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {chartData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.value} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-2xl font-bold">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
