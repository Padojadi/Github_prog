'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  QrCode,
  Download,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import QRCodeLib from 'qrcode'

interface AccessRequest {
  id: string
  start_time: string
  end_time: string
  num_guests: number
  special_requests?: string
  created_at: string
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
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  processed_at?: string
  booking_id?: string
  qr_code_data?: string
}

export default function MyRequestsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const qrCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadRequests()

      const channel = supabase
        .channel('user-access-requests')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'access_requests',
          filter: `user_id=eq.${user.id}`
        }, () => {
          loadRequests()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const loadRequests = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading requests:', error)
        throw error
      }

      setRequests(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>
      case 'approved':
        return <Badge className="bg-green-600">Approuvée</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const generateQRCode = async (requestId: string, data: string) => {
    try {
      const qrDataUrl = await QRCodeLib.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrCodes(prev => ({ ...prev, [requestId]: qrDataUrl }))
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Erreur lors de la génération du QR code')
    }
  }

  const downloadQRCode = (requestId: string, guestName: string) => {
    const qrDataUrl = qrCodes[requestId]
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-code-${guestName.replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code téléchargé avec succès')
  }

  useEffect(() => {
    requests.forEach(request => {
      if (request.status === 'approved' && request.qr_code_data && !qrCodes[request.id]) {
        generateQRCode(request.id, request.qr_code_data)
      }
    })
  }, [requests])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Chargement de vos demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes demandes d'accès</h1>
          <p className="text-muted-foreground mt-2">
            Consultez l'état de vos demandes d'accès au salon
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadRequests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => router.push('/access-request')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Aucune demande d'accès trouvée</p>
            <Button onClick={() => router.push('/access-request')}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une demande
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <CardTitle>
                        {request.guest_first_name} {request.guest_last_name}
                      </CardTitle>
                      <CardDescription>
                        {request.guest_function} - {request.guest_organization}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(new Date(request.start_time), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Horaire</p>
                      <p className="font-medium">
                        {format(new Date(request.start_time), 'HH:mm')} - {format(new Date(request.end_time), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Accompagnants</p>
                    <p className="font-medium">{request.num_guests} {request.num_guests > 1 ? 'personnes' : 'personne'}</p>
                  </div>
                </div>

                {(request.airline || request.flight_number) && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Informations de vol</p>
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      {request.airline && (
                        <div>
                          <span className="text-muted-foreground">Compagnie: </span>
                          <span className="font-medium">{request.airline}</span>
                        </div>
                      )}
                      {request.flight_number && (
                        <div>
                          <span className="text-muted-foreground">Vol: </span>
                          <span className="font-medium">{request.flight_number}</span>
                        </div>
                      )}
                      {request.flight_origin && (
                        <div>
                          <span className="text-muted-foreground">Provenance: </span>
                          <span className="font-medium">{request.flight_origin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.special_requests && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-1">Vos remarques</p>
                    <p className="text-sm text-muted-foreground">{request.special_requests}</p>
                  </div>
                )}

                {request.status === 'approved' && request.qr_code_data && (
                  <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <QrCode className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium">Votre QR Code d'accès</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Présentez ce QR code à votre arrivée au salon. Vous pouvez également le télécharger pour l'avoir hors ligne.
                        </p>
                        <Button
                          onClick={() => downloadQRCode(request.id, `${request.guest_first_name}-${request.guest_last_name}`)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le QR Code
                        </Button>
                      </div>
                      <div className="flex-shrink-0">
                        {qrCodes[request.id] && (
                          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                            <img
                              src={qrCodes[request.id]}
                              alt="QR Code"
                              className="w-48 h-48"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {request.status !== 'pending' && request.processed_at && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">
                      {request.status === 'approved' ? 'Réponse de l\'administration' : 'Raison du rejet'}
                    </p>
                    {request.admin_notes && (
                      <p className="text-sm text-muted-foreground mb-2">{request.admin_notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Traité le {format(new Date(request.processed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Votre demande est en cours d'examen par l'administration</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
