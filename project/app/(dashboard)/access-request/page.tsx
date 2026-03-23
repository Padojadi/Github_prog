'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { loungeAccessRequestSchema, type LoungeAccessRequestInput, type DelegationMember } from '@/lib/validations/booking'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const FAMILY_RELATIONS = [
  'Conjoint',
  'Père',
  'Mère',
  'Enfant',
  'Frère',
  'Soeur',
  'Autre membre de famille',
]

const PASSPORT_TYPES = [
  'Ordinaire',
  'Service/Officiel',
  'Diplomatique',
]

export default function AccessRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companionType, setCompanionType] = useState<string>('Aucun')
  const [delegationMembers, setDelegationMembers] = useState<DelegationMember[]>([])
  const [flightType, setFlightType] = useState<string>('Arrivée')

  const form = useForm<LoungeAccessRequestInput>({
    resolver: zodResolver(loungeAccessRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      function: '',
      phone: '',
      organization: '',
      nationality: '',
      passportType: '',
      passportNumber: '',
      travelPurpose: '',
      companionType: 'Aucun',
      familyRelation: '',
      delegationMembers: [],
      airline: '',
      flightNumber: '',
      flightOrigin: '',
      specialRequests: '',
    },
  })

  const addDelegationMember = () => {
    setDelegationMembers([
      ...delegationMembers,
      { nom: '', prenom: '', fonction: '', numeroPasSeport: '', typePasSeport: '' },
    ])
  }

  const removeDelegationMember = (index: number) => {
    const newMembers = delegationMembers.filter((_, i) => i !== index)
    setDelegationMembers(newMembers)
    form.setValue('delegationMembers', newMembers)
  }

  const updateDelegationMember = (index: number, field: keyof DelegationMember, value: string) => {
    const newMembers = [...delegationMembers]
    newMembers[index][field] = value
    setDelegationMembers(newMembers)
    form.setValue('delegationMembers', newMembers)
  }

  const onSubmit = async (data: LoungeAccessRequestInput) => {
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Vous devez être connecté pour soumettre une demande')
        return
      }

      const startTime = data.startTime.toISOString()
      const endTime = data.endTime.toISOString()
      const flightArrivalTime = data.flightArrivalTime?.toISOString()

      const { error } = await supabase
        .from('access_requests')
        .insert({
          user_id: user.id,
          guest_first_name: data.firstName,
          guest_last_name: data.lastName,
          guest_function: data.function,
          guest_phone: data.phone,
          guest_organization: data.organization,
          guest_nationality: data.nationality,
          passport_type: data.passportType,
          passport_number: data.passportNumber,
          travel_purpose: data.travelPurpose || null,
          companion_type: data.companionType || null,
          family_relation: data.familyRelation || null,
          family_members: data.companionType === 'Famille' && data.familyMembers ? data.familyMembers : [],
          delegation_members: data.companionType === 'Délégation' && data.delegationMembers ? data.delegationMembers : [],
          airline: data.airline || null,
          flight_number: data.flightNumber || null,
          flight_origin: data.flightOrigin || null,
          flight_arrival_time: flightArrivalTime || null,
          start_time: startTime,
          end_time: endTime,
          num_guests: 1,
          special_requests: data.specialRequests || null,
        } as any)

      if (error) {
        console.error('Error creating access request:', error)
        toast.error('Erreur lors de la création de la demande')
        return
      }

      toast.success('Demande d\'accès soumise avec succès')
      router.push('/bookings')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Demande d'accès au salon</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour demander l'accès à un salon VIP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénoms *</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez vos prénoms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="function"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonction *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Directeur, Ministre, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+221 XX XXX XX XX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisme *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'organisme" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationalité *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sénégalaise, Française, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de passeport *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type de passeport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ordinaire">Passeport ordinaire</SelectItem>
                          <SelectItem value="Service/Officiel">Passeport de service/officiel</SelectItem>
                          <SelectItem value="Diplomatique">Passeport diplomatique</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de passeport *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AB1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Motif du voyage et accompagnants</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="travelPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif du voyage</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le motif de votre voyage"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'accompagnant</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setCompanionType(value)
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type d'accompagnant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Aucun">Aucun</SelectItem>
                            <SelectItem value="Famille">Famille</SelectItem>
                            <SelectItem value="Délégation">Délégation</SelectItem>
                            <SelectItem value="Autres">Autres</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {companionType === 'Famille' && (
                    <FormField
                      control={form.control}
                      name="familyRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relation familiale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner la relation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FAMILY_RELATIONS.map((relation) => (
                                <SelectItem key={relation} value={relation}>
                                  {relation}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {(companionType === 'Délégation' || companionType === 'Autres') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          {companionType === 'Délégation' ? 'Membres de la délégation' : 'Accompagnants'}
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addDelegationMember}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un membre
                        </Button>
                      </div>
                      {delegationMembers.map((member, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium">
                              {companionType === 'Délégation' ? 'Membre' : 'Accompagnant'} {index + 1}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDelegationMember(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <FormLabel>Nom *</FormLabel>
                              <Input
                                placeholder="Nom"
                                value={member.nom}
                                onChange={(e) => updateDelegationMember(index, 'nom', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormLabel>Prénom *</FormLabel>
                              <Input
                                placeholder="Prénom"
                                value={member.prenom}
                                onChange={(e) => updateDelegationMember(index, 'prenom', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormLabel>Fonction *</FormLabel>
                              <Input
                                placeholder="Fonction"
                                value={member.fonction}
                                onChange={(e) => updateDelegationMember(index, 'fonction', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormLabel>Numéro de passeport *</FormLabel>
                              <Input
                                placeholder="Numéro de passeport"
                                value={member.numeroPasSeport}
                                onChange={(e) => updateDelegationMember(index, 'numeroPasSeport', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <FormLabel>Type de passeport *</FormLabel>
                              <Select
                                value={member.typePasSeport}
                                onValueChange={(value) => updateDelegationMember(index, 'typePasSeport', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner le type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PASSPORT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Informations de vol (optionnel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel>Type de vol</FormLabel>
                    <Select
                      value={flightType}
                      onValueChange={setFlightType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de vol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arrivée">Arrivée</SelectItem>
                        <SelectItem value="Départ">Départ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compagnie aérienne</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Air France, Emirates" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de vol</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: AF123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightOrigin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{flightType === 'Arrivée' ? 'Provenance' : 'Destination'}</FormLabel>
                        <FormControl>
                          <Input placeholder={flightType === 'Arrivée' ? 'Ex: Paris CDG' : 'Ex: New York JFK'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightArrivalTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{flightType === 'Arrivée' ? "Heure d'arrivée" : 'Heure de départ'}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP HH:mm', { locale: fr })
                                ) : (
                                  <span>Sélectionner</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={fr}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':')
                                  const date = field.value || new Date()
                                  date.setHours(parseInt(hours), parseInt(minutes))
                                  field.onChange(date)
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Période d'accès au salon *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date et heure de début</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP HH:mm', { locale: fr })
                                ) : (
                                  <span>Sélectionner</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={fr}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':')
                                  const date = field.value || new Date()
                                  date.setHours(parseInt(hours), parseInt(minutes))
                                  field.onChange(date)
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date et heure de fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP HH:mm', { locale: fr })
                                ) : (
                                  <span>Sélectionner</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={fr}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':')
                                  const date = field.value || new Date()
                                  date.setHours(parseInt(hours), parseInt(minutes))
                                  field.onChange(date)
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarques</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Demandes spéciales ou informations supplémentaires"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground italic">
                *Frais d'accès à payer sur place.
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
