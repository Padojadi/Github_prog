'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Lounge } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, Users, MapPin, ArrowLeft, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/currency'

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const loungeIdParam = searchParams.get('loungeId')

  const [lounges, setLounges] = useState<Lounge[]>([])
  const [selectedLounge, setSelectedLounge] = useState<Lounge | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    loungeId: loungeIdParam || '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    numGuests: '',
    specialRequests: '',
    paymentMethod: 'on_site' as 'online' | 'on_site',
  })

  useEffect(() => {
    loadLounges()
  }, [])

  useEffect(() => {
    if (formData.loungeId && lounges.length > 0) {
      const lounge = lounges.find(l => l.id === formData.loungeId)
      setSelectedLounge(lounge || null)
    }
  }, [formData.loungeId, lounges])

  const loadLounges = async () => {
    try {
      const { data, error } = await supabase
        .from('lounges')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) throw error

      const loungesData = (data as Lounge[]) || []
      setLounges(loungesData)

      if (loungeIdParam && loungesData.length > 0) {
        const lounge = loungesData.find(l => l.id === loungeIdParam)
        setSelectedLounge(lounge || null)
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement des salons')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!selectedLounge || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      return 0
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    const end = new Date(`${formData.endDate}T${formData.endTime}`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    if (hours <= 0) return 0

    return hours * Number(selectedLounge.hourly_rate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Vous devez être connecté pour réserver')
      router.push('/login')
      return
    }

    if (!formData.loungeId || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !formData.numGuests) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const numGuests = parseInt(formData.numGuests)
    if (selectedLounge && numGuests > selectedLounge.capacity) {
      toast.error(`Le nombre d'invités ne peut pas dépasser ${selectedLounge.capacity}`)
      return
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

    if (endDateTime <= startDateTime) {
      toast.error('La date et l\'heure de fin doivent être après la date et l\'heure de début')
      return
    }

    if (startDateTime < new Date()) {
      toast.error('La date et l\'heure de début doivent être dans le futur')
      return
    }

    setSubmitting(true)

    try {
      const totalAmount = calculateTotal()

      const bookingData = {
        user_id: user.id,
        lounge_id: formData.loungeId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        num_guests: numGuests,
        total_amount: totalAmount,
        special_requests: formData.specialRequests || null,
        status: 'pending' as const,
        payment_method: formData.paymentMethod,
        payment_status: 'pending' as const,
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData] as any)
        .select()
        .single()

      if (error) throw error

      toast.success('Réservation créée avec succès!')
      router.push('/bookings')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la réservation')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/lounges">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux salons
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Nouvelle Réservation</h1>
        <p className="text-muted-foreground">Réservez un salon d&apos;honneur pour votre événement</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la réservation</CardTitle>
              <CardDescription>Remplissez les informations ci-dessous</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lounge">Salon *</Label>
                  <Select
                    value={formData.loungeId}
                    onValueChange={(value) => setFormData({ ...formData, loungeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un salon" />
                    </SelectTrigger>
                    <SelectContent>
                      {lounges.map((lounge) => (
                        <SelectItem key={lounge.id} value={lounge.id}>
                          <div className="flex items-center gap-2">
                            <span>{lounge.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({lounge.capacity} invités max)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Heure de début *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Heure de fin *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numGuests">Nombre d&apos;invités *</Label>
                  <Input
                    id="numGuests"
                    type="number"
                    min="1"
                    max={selectedLounge?.capacity || 1000}
                    value={formData.numGuests}
                    onChange={(e) => setFormData({ ...formData, numGuests: e.target.value })}
                    required
                  />
                  {selectedLounge && (
                    <p className="text-xs text-muted-foreground">
                      Capacité maximale: {selectedLounge.capacity} invités
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Mode de paiement *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value: 'online' | 'on_site') => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on_site">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>Paiement sur place</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="online">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>Paiement en ligne</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {formData.paymentMethod === 'online'
                      ? 'Vous pourrez payer directement après la validation de votre réservation'
                      : 'Vous paierez directement au salon lors de votre arrivée'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Indiquez toute demande spéciale pour votre événement..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting || !formData.loungeId} className="flex-1">
                    {submitting ? 'Création...' : 'Confirmer la réservation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedLounge ? (
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedLounge.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedLounge.location}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  {formData.startDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Date de début
                      </span>
                      <span className="font-medium">
                        {new Date(formData.startDate).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {formData.endDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Date de fin
                      </span>
                      <span className="font-medium">
                        {new Date(formData.endDate).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {formData.startTime && formData.endTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Horaire
                      </span>
                      <span className="font-medium">
                        {formData.startTime} - {formData.endTime}
                      </span>
                    </div>
                  )}

                  {formData.numGuests && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Invités
                      </span>
                      <span className="font-medium">{formData.numGuests}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Tarif horaire</span>
                    <span className="font-medium">{formatCurrency(selectedLounge.hourly_rate)}/h</span>
                  </div>
                  {formData.startDate && formData.endDate && formData.startTime && formData.endTime && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Durée</span>
                        <span className="font-medium">
                          {(() => {
                            const start = new Date(`${formData.startDate}T${formData.startTime}`)
                            const end = new Date(`${formData.endDate}T${formData.endTime}`)
                            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                            if (hours <= 0) return '-'
                            if (hours >= 24) {
                              const days = Math.floor(hours / 24)
                              const remainingHours = hours % 24
                              return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`
                            }
                            return `${hours}h`
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Mode de paiement</span>
                        <span className="font-medium">
                          {formData.paymentMethod === 'online' ? 'En ligne' : 'Sur place'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">Sélectionnez un salon pour voir le récapitulatif</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
