'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Search,
  CheckCircle2,
  Eye,
  RefreshCw,
  Building2,
  Plane,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AccessRequest {
  id: string
  user_id: string
  start_time: string
  end_time: string
  num_guests: number
  special_requests?: string
  guest_first_name: string
  guest_last_name: string
  guest_function: string
  guest_phone: string
  guest_organization: string
  guest_nationality: string
  airline?: string
  flight_number?: string
  flight_origin?: string
  flight_arrival_time?: string
  status: string
  approved_lounge_id?: string
  admin_notes?: string
  processed_at?: string
  approved_companions?: any
  rejected_companions?: any
  profile: {
    id: string
    full_name: string
    email: string
  }
}

interface Lounge {
  id: string
  name: string
  location: string
}

interface Companion {
  firstName: string
  lastName: string
  nationality: string
  passportNumber?: string
  relation?: string
}

export default function ApprovedRequestsPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AccessRequest[]>([])
  const [lounges, setLounges] = useState<Lounge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      loadRequests()
      loadLounges()
    }
  }, [isAdmin])

  useEffect(() => {
    const filtered = requests.filter(request => {
      const searchLower = searchQuery.toLowerCase()
      return (
        request.guest_first_name.toLowerCase().includes(searchLower) ||
        request.guest_last_name.toLowerCase().includes(searchLower) ||
        request.guest_organization.toLowerCase().includes(searchLower) ||
        request.guest_phone.includes(searchLower)
      )
    })
    setFilteredRequests(filtered)
  }, [searchQuery, requests])

  const loadRequests = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('access_requests')
        .select(`
          *,
          profile:user_id(id, full_name, email)
        `)
        .eq('status', 'approved')
        .order('processed_at', { ascending: false })

      if (error) throw error

      const validRequests = (data as any)?.filter((r: any) => r.profile) || []
      setRequests(validRequests)
    } catch (error: any) {
      console.error('Error loading approved requests:', error)
      toast.error('Erreur lors du chargement des demandes approuvées')
    } finally {
      setLoading(false)
    }
  }

  const loadLounges = async () => {
    try {
      const { data, error } = await supabase
        .from('lounges')
        .select('id, name, location')
        .order('name')

      if (error) throw error
      setLounges(data || [])
    } catch (error) {
      console.error('Error loading lounges:', error)
    }
  }

  const getCompanions = (request: AccessRequest): Companion[] => {
    if (!request.approved_companions) return []

    try {
      if (Array.isArray(request.approved_companions)) {
        return request.approved_companions
      }
      return []
    } catch (error) {
      return []
    }
  }

  const getRejectedCompanions = (request: AccessRequest): Companion[] => {
    if (!request.rejected_companions) return []

    try {
      if (Array.isArray(request.rejected_companions)) {
        return request.rejected_companions
      }
      return []
    } catch (error) {
      return []
    }
  }

  const getLoungeById = (loungeId?: string) => {
    if (!loungeId) return null
    return lounges.find(l => l.id === loungeId)
  }

  const handleViewDetails = (request: AccessRequest) => {
    setSelectedRequest(request)
    setShowDetailsDialog(true)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demandes Acceptées</h1>
          <p className="text-muted-foreground mt-1">
            Toutes les demandes d'accès qui ont été approuvées
          </p>
        </div>
        <Button onClick={loadRequests} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Demandes approuvées</CardTitle>
              <CardDescription>
                {filteredRequests.length} demande(s) approuvée(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, organisation ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Aucune demande approuvée trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const lounge = getLoungeById(request.approved_lounge_id)
                const companions = getCompanions(request)
                const rejectedCompanions = getRejectedCompanions(request)

                return (
                  <Card key={request.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approuvé
                            </Badge>
                            {lounge && (
                              <Badge variant="secondary">
                                <Building2 className="h-3 w-3 mr-1" />
                                {lounge.name}
                              </Badge>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {request.guest_first_name} {request.guest_last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {request.guest_function} - {request.guest_organization}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{format(new Date(request.start_time), 'dd MMM yyyy', { locale: fr })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(request.start_time), 'HH:mm', { locale: fr })} - {format(new Date(request.end_time), 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                            {request.airline && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Plane className="h-4 w-4" />
                                <span>{request.airline} {request.flight_number}</span>
                              </div>
                            )}
                            {companions.length > 0 && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{companions.length} accompagnant(s) approuvé(s)</span>
                              </div>
                            )}
                          </div>

                          {request.processed_at && (
                            <p className="text-xs text-muted-foreground">
                              Approuvé le {format(new Date(request.processed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande approuvée</DialogTitle>
            <DialogDescription>
              Informations complètes sur la demande d'accès
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Demande Approuvée</span>
                </div>
                {selectedRequest.processed_at && (
                  <p className="text-sm text-green-700">
                    Le {format(new Date(selectedRequest.processed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Informations du visiteur</h4>
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <p><span className="font-medium">Nom:</span> {selectedRequest.guest_first_name} {selectedRequest.guest_last_name}</p>
                  <p><span className="font-medium">Fonction:</span> {selectedRequest.guest_function}</p>
                  <p><span className="font-medium">Organisation:</span> {selectedRequest.guest_organization}</p>
                  <p><span className="font-medium">Nationalité:</span> {selectedRequest.guest_nationality}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedRequest.guest_phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Informations de visite</h4>
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <p><span className="font-medium">Date:</span> {format(new Date(selectedRequest.start_time), 'dd MMMM yyyy', { locale: fr })}</p>
                  <p><span className="font-medium">Horaire:</span> {format(new Date(selectedRequest.start_time), 'HH:mm', { locale: fr })} - {format(new Date(selectedRequest.end_time), 'HH:mm', { locale: fr })}</p>
                  {getLoungeById(selectedRequest.approved_lounge_id) && (
                    <p><span className="font-medium">Salon assigné:</span> {getLoungeById(selectedRequest.approved_lounge_id)?.name} - {getLoungeById(selectedRequest.approved_lounge_id)?.location}</p>
                  )}
                </div>
              </div>

              {(selectedRequest.airline || selectedRequest.flight_number) && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Informations de vol</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                    {selectedRequest.airline && <p><span className="font-medium">Compagnie:</span> {selectedRequest.airline}</p>}
                    {selectedRequest.flight_number && <p><span className="font-medium">Numéro de vol:</span> {selectedRequest.flight_number}</p>}
                    {selectedRequest.flight_origin && <p><span className="font-medium">Origine:</span> {selectedRequest.flight_origin}</p>}
                    {selectedRequest.flight_arrival_time && (
                      <p><span className="font-medium">Heure d'arrivée:</span> {format(new Date(selectedRequest.flight_arrival_time), 'HH:mm', { locale: fr })}</p>
                    )}
                  </div>
                </div>
              )}

              {getCompanions(selectedRequest).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Accompagnants approuvés ({getCompanions(selectedRequest).length})</h4>
                  <div className="space-y-2">
                    {getCompanions(selectedRequest).map((companion, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                        <p className="font-medium">{companion.firstName} {companion.lastName}</p>
                        <p className="text-muted-foreground">Nationalité: {companion.nationality}</p>
                        {companion.passportNumber && (
                          <p className="text-muted-foreground">Passeport: {companion.passportNumber}</p>
                        )}
                        {companion.relation && (
                          <p className="text-muted-foreground">Relation: {companion.relation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getRejectedCompanions(selectedRequest).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Accompagnants refusés ({getRejectedCompanions(selectedRequest).length})</h4>
                  <div className="space-y-2">
                    {getRejectedCompanions(selectedRequest).map((companion, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
                        <p className="font-medium">{companion.firstName} {companion.lastName}</p>
                        <p className="text-muted-foreground">Nationalité: {companion.nationality}</p>
                        {companion.passportNumber && (
                          <p className="text-muted-foreground">Passeport: {companion.passportNumber}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.admin_notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Note de l'administrateur</h4>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {selectedRequest.admin_notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
