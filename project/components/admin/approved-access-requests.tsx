'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, Clock, Users, Eye, Building2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

interface AccessRequest {
  id: string
  guest_first_name: string
  guest_last_name: string
  guest_organization: string
  start_time: string
  end_time: string
  num_guests: number
  status: string
  lounge_id?: string
  lounge?: {
    name: string
  }
  created_at: string
}

interface ApprovedAccessRequestsProps {
  requests: AccessRequest[]
}

export function ApprovedAccessRequests({ requests }: ApprovedAccessRequestsProps) {
  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes Acceptées</CardTitle>
          <CardDescription>Les demandes d'accès approuvées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune demande acceptée</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Demandes Acceptées</CardTitle>
          <CardDescription>{requests.length} demande(s) approuvée(s)</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/approved-requests">
            <Eye className="h-4 w-4 mr-2" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-l-green-500"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {request.guest_first_name} {request.guest_last_name}
                  </p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Accepté
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.guest_organization}</p>
                {request.lounge && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Building2 className="h-3 w-3" />
                    <span>{request.lounge.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(request.start_time), 'dd MMM yyyy', { locale: fr })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(request.start_time), 'HH:mm', { locale: fr })} - {format(new Date(request.end_time), 'HH:mm', { locale: fr })}
                  </span>
                  {request.num_guests > 1 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {request.num_guests} personnes
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/approved-requests">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
