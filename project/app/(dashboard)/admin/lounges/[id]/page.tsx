'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { loungeSchema } from '@/lib/validations/lounge'

interface Amenity {
  id: string
  name: string
}

export default function EditLoungePage({ params }: { params: { id: string } }) {
  const { isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [amenities, setAmenities] = useState<Amenity[]>([])

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    capacity: '',
    hourly_rate: '',
    daily_rate: '',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    image_url: '',
    open_time: '',
    close_time: '',
    min_booking_duration: '',
    max_booking_duration: '',
    advance_booking_days: '',
    cancellation_hours: '',
    selectedAmenities: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/lounges')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      loadLounge()
      loadAmenities()
    }
  }, [isAdmin, params.id])

  const loadLounge = async () => {
    try {
      const { data: lounge, error } = await supabase
        .from('lounges')
        .select(`
          *,
          lounge_amenities(amenity_id)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (lounge) {
        const loungeData = lounge as any
        setFormData({
          name: loungeData.name || '',
          location: loungeData.location || '',
          description: loungeData.description || '',
          capacity: loungeData.capacity?.toString() || '',
          hourly_rate: loungeData.hourly_rate?.toString() || '',
          daily_rate: loungeData.daily_rate?.toString() || '',
          status: loungeData.status || 'active',
          image_url: loungeData.image_url || '',
          open_time: loungeData.open_time || '',
          close_time: loungeData.close_time || '',
          min_booking_duration: loungeData.min_booking_duration?.toString() || '',
          max_booking_duration: loungeData.max_booking_duration?.toString() || '',
          advance_booking_days: loungeData.advance_booking_days?.toString() || '',
          cancellation_hours: loungeData.cancellation_hours?.toString() || '',
          selectedAmenities: loungeData.lounge_amenities?.map((la: any) => la.amenity_id) || [],
        })
      }
    } catch (error) {
      console.error('Error loading lounge:', error)
      toast.error('Erreur lors du chargement du salon')
    } finally {
      setLoading(false)
    }
  }

  const loadAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('id, name')
        .order('name')

      if (error) throw error
      setAmenities(data || [])
    } catch (error) {
      console.error('Error loading amenities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)

    try {
      const validationData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        hourly_rate: parseFloat(formData.hourly_rate),
        daily_rate: parseFloat(formData.daily_rate),
        status: formData.status,
        image_url: formData.image_url || undefined,
        open_time: formData.open_time,
        close_time: formData.close_time,
        min_booking_duration: parseInt(formData.min_booking_duration),
        max_booking_duration: parseInt(formData.max_booking_duration),
        advance_booking_days: parseInt(formData.advance_booking_days),
        cancellation_hours: parseInt(formData.cancellation_hours),
      }

      loungeSchema.parse(validationData)

      const { error: loungeError } = await (supabase
        .from('lounges') as any)
        .update(validationData)
        .eq('id', params.id)

      if (loungeError) throw loungeError

      const { error: deleteError } = await (supabase
        .from('lounge_amenities') as any)
        .delete()
        .eq('lounge_id', params.id)

      if (deleteError) throw deleteError

      if (formData.selectedAmenities.length > 0) {
        const amenityInserts = formData.selectedAmenities.map((amenityId) => ({
          lounge_id: params.id,
          amenity_id: amenityId,
        }))

        const { error: amenitiesError } = await (supabase
          .from('lounge_amenities') as any)
          .insert(amenityInserts)

        if (amenitiesError) throw amenitiesError
      }

      toast.success('Salon modifié avec succès')
      router.push('/admin/lounges')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Veuillez corriger les erreurs dans le formulaire')
      } else {
        console.error('Error updating lounge:', error)
        toast.error('Erreur lors de la modification du salon')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const { error } = await (supabase
        .from('lounges') as any)
        .delete()
        .eq('id', params.id)

      if (error) throw error

      toast.success('Salon supprimé avec succès')
      router.push('/admin/lounges')
    } catch (error) {
      console.error('Error deleting lounge:', error)
      toast.error('Erreur lors de la suppression du salon')
      setDeleting(false)
    }
  }

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityId)
        ? prev.selectedAmenities.filter((id) => id !== amenityId)
        : [...prev.selectedAmenities, amenityId],
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/lounges')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux salons
        </Button>
        <h1 className="text-3xl font-bold">Modifier le salon</h1>
        <p className="text-muted-foreground mt-2">
          Modifiez les informations du salon ou supprimez-le
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Les informations de base du salon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du salon *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Salon VIP"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Emplacement *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Ex: Terminal 1, Étage 2"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Décrivez le salon..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'maintenance' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacité et tarifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="Nombre de personnes"
              />
              {errors.capacity && (
                <p className="text-sm text-red-500">{errors.capacity}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Tarif horaire (XOF) *</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourly_rate: e.target.value })
                  }
                  placeholder="0"
                />
                {errors.hourly_rate && (
                  <p className="text-sm text-red-500">{errors.hourly_rate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily_rate">Tarif journalier (XOF) *</Label>
                <Input
                  id="daily_rate"
                  type="number"
                  value={formData.daily_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, daily_rate: e.target.value })
                  }
                  placeholder="0"
                />
                {errors.daily_rate && (
                  <p className="text-sm text-red-500">{errors.daily_rate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horaires d'ouverture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="open_time">Heure d'ouverture *</Label>
                <Input
                  id="open_time"
                  type="time"
                  value={formData.open_time}
                  onChange={(e) =>
                    setFormData({ ...formData, open_time: e.target.value })
                  }
                />
                {errors.open_time && (
                  <p className="text-sm text-red-500">{errors.open_time}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="close_time">Heure de fermeture *</Label>
                <Input
                  id="close_time"
                  type="time"
                  value={formData.close_time}
                  onChange={(e) =>
                    setFormData({ ...formData, close_time: e.target.value })
                  }
                />
                {errors.close_time && (
                  <p className="text-sm text-red-500">{errors.close_time}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Règles de réservation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min_booking_duration">
                  Durée minimale (heures) *
                </Label>
                <Input
                  id="min_booking_duration"
                  type="number"
                  value={formData.min_booking_duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_booking_duration: e.target.value,
                    })
                  }
                  placeholder="1"
                />
                {errors.min_booking_duration && (
                  <p className="text-sm text-red-500">
                    {errors.min_booking_duration}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_booking_duration">
                  Durée maximale (heures) *
                </Label>
                <Input
                  id="max_booking_duration"
                  type="number"
                  value={formData.max_booking_duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_booking_duration: e.target.value,
                    })
                  }
                  placeholder="24"
                />
                {errors.max_booking_duration && (
                  <p className="text-sm text-red-500">
                    {errors.max_booking_duration}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="advance_booking_days">
                  Réservation à l'avance (jours) *
                </Label>
                <Input
                  id="advance_booking_days"
                  type="number"
                  value={formData.advance_booking_days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      advance_booking_days: e.target.value,
                    })
                  }
                  placeholder="30"
                />
                {errors.advance_booking_days && (
                  <p className="text-sm text-red-500">
                    {errors.advance_booking_days}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_hours">
                  Délai d'annulation (heures) *
                </Label>
                <Input
                  id="cancellation_hours"
                  type="number"
                  value={formData.cancellation_hours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cancellation_hours: e.target.value,
                    })
                  }
                  placeholder="24"
                />
                {errors.cancellation_hours && (
                  <p className="text-sm text-red-500">
                    {errors.cancellation_hours}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Équipements</CardTitle>
            <CardDescription>
              Sélectionnez les équipements disponibles dans ce salon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    formData.selectedAmenities.includes(amenity.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleAmenity(amenity.id)}
                >
                  <span className="text-sm font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting || submitting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer le salon
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce salon ? Cette action est
                  irréversible et supprimera toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/lounges')}
              disabled={submitting || deleting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting || deleting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
