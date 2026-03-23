'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { loungeSchema, type LoungeInput } from '@/lib/validations/lounge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

const LOUNGE_TYPES = [
  'Executive',
  'Ambassadeur',
  'Ministériel',
  'Institution',
]

const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
]

const AVAILABLE_AMENITIES = [
  'WiFi gratuit',
  'Écran de présentation',
  'Climatisation',
  'Service de restauration',
  'Espace de stationnement',
  'Équipement audiovisuel',
  'Tableau blanc',
  'Imprimante',
  'Téléphone de conférence',
]

export default function NewLoungePage() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<Array<{ start: string; end: string }>>([
    { start: '09:00', end: '17:00' }
  ])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/lounges')
    }
  }, [isAdmin, authLoading, router])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoungeInput>({
    resolver: zodResolver(loungeSchema),
    defaultValues: {
      status: 'active',
      amenities: [],
      availableDays: [],
      timeSlots: [{ start: '09:00', end: '17:00' }],
    },
  })

  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day]
    setSelectedDays(newDays)
    setValue('availableDays', newDays)
  }

  const handleAddTimeSlot = () => {
    const newSlots = [...timeSlots, { start: '09:00', end: '17:00' }]
    setTimeSlots(newSlots)
    setValue('timeSlots', newSlots)
  }

  const handleRemoveTimeSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index)
    setTimeSlots(newSlots)
    setValue('timeSlots', newSlots)
  }

  const handleTimeSlotChange = (index: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots]
    newSlots[index][field] = value
    setTimeSlots(newSlots)
    setValue('timeSlots', newSlots)
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity]
    setSelectedAmenities(newAmenities)
    setValue('amenities', newAmenities)
  }

  const onSubmit = async (data: LoungeInput) => {
    setLoading(true)

    const { error } = await supabase.from('lounges').insert({
      name: data.name,
      description: data.description || null,
      capacity: data.capacity,
      hourly_rate: data.hourlyRate,
      location: data.location,
      status: data.status,
      amenities: JSON.parse(JSON.stringify(data.amenities || [])),
      image_url: data.imageUrl || null,
      lounge_type: data.loungeType,
      max_bookings: data.maxBookings,
      available_days: JSON.parse(JSON.stringify(data.availableDays)),
      time_slots: JSON.parse(JSON.stringify(data.timeSlots)),
    } as any)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Salon créé avec succès')
    router.push('/admin/lounges')
  }

  if (authLoading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ajouter un nouveau salon</h1>
        <p className="text-slate-600 dark:text-slate-400">Créer un nouveau salon VIP</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du salon</Label>
              <Input id="name" placeholder="Salon Executive" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loungeType">Type de salon</Label>
              <Select onValueChange={(value) => setValue('loungeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {LOUNGE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.loungeType && (
                <p className="text-sm text-red-500">{errors.loungeType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Un espace lounge premium avec équipements modernes..."
                {...register('description')}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input id="location" placeholder="Bâtiment A, Étage 5" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacité et tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="10"
                  {...register('capacity', { valueAsNumber: true })}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">{errors.capacity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBookings">Nombre max de réservations</Label>
                <Input
                  id="maxBookings"
                  type="number"
                  placeholder="5"
                  {...register('maxBookings', { valueAsNumber: true })}
                />
                {errors.maxBookings && (
                  <p className="text-sm text-red-500">{errors.maxBookings.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  {...register('hourlyRate', { valueAsNumber: true })}
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier et créneaux horaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Jours disponibles</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <label
                      htmlFor={day}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
              {errors.availableDays && (
                <p className="text-sm text-red-500">{errors.availableDays.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Créneaux horaires</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTimeSlot}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un créneau
                </Button>
              </div>
              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Début</Label>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Fin</Label>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
                        />
                      </div>
                    </div>
                    {timeSlots.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.timeSlots && (
                <p className="text-sm text-red-500">{errors.timeSlots.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services offerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            {errors.amenities && (
              <p className="text-sm text-red-500">{errors.amenities.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autres paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l'image (Optionnel)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl')}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Création en cours...' : 'Créer le salon'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
