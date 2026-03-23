'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/hooks/use-auth'
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function DiagnosticPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)

  const runDiagnostic = async () => {
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }

    setLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/diagnose-user-access`

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticData(data)
      toast.success('Diagnostic terminé')
    } catch (error) {
      console.error('Diagnostic error:', error)
      toast.error('Erreur lors du diagnostic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Diagnostic utilisateur</h1>
        <p className="text-muted-foreground mt-2">
          Vérifiez vos permissions et l'accès aux données
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lancer le diagnostic</CardTitle>
          <CardDescription>
            Cet outil vérifie vos informations de compte, votre profil et l'accès à vos demandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostic} disabled={loading || !user}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
          </Button>
        </CardContent>
      </Card>

      {diagnosticData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Informations utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Email:</span> {diagnosticData.user.email}
              </div>
              <div>
                <span className="font-medium">ID:</span>
                <code className="ml-2 text-xs bg-slate-100 px-2 py-1 rounded">{diagnosticData.user.id}</code>
              </div>
              <div>
                <span className="font-medium">Créé le:</span> {new Date(diagnosticData.user.created_at).toLocaleString('fr-FR')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {diagnosticData.profile ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnosticData.profile ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Rôle:</span>
                    <Badge className="ml-2">{diagnosticData.profile.role}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Prénom:</span> {diagnosticData.profile.first_name || 'Non renseigné'}
                  </div>
                  <div>
                    <span className="font-medium">Nom:</span> {diagnosticData.profile.last_name || 'Non renseigné'}
                  </div>
                  <div>
                    <span className="font-medium">Téléphone:</span> {diagnosticData.profile.phone || 'Non renseigné'}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun profil trouvé. Erreur: {diagnosticData.profileError || 'Inconnue'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {diagnosticData.accessRequestsCount > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                Demandes d'accès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Nombre total:</span>
                  <Badge className="ml-2" variant="secondary">{diagnosticData.accessRequestsCount}</Badge>
                </div>
                {diagnosticData.requestsError && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Erreur lors du chargement: {diagnosticData.requestsError}
                    </AlertDescription>
                  </Alert>
                )}
                {diagnosticData.accessRequestsCount === 0 && !diagnosticData.requestsError && (
                  <Alert>
                    <AlertDescription>
                      Vous n'avez aucune demande d'accès pour le moment.
                    </AlertDescription>
                  </Alert>
                )}
                {diagnosticData.accessRequestsCount > 0 && (
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <p className="text-sm font-medium mb-2">Répartition par statut:</p>
                    <div className="space-y-1 text-sm">
                      <div>
                        <Badge variant="secondary" className="mr-2">En attente</Badge>
                        {diagnosticData.accessRequests.filter((r: any) => r.status === 'pending').length}
                      </div>
                      <div>
                        <Badge className="bg-green-600 mr-2">Approuvées</Badge>
                        {diagnosticData.accessRequests.filter((r: any) => r.status === 'approved').length}
                      </div>
                      <div>
                        <Badge variant="destructive" className="mr-2">Rejetées</Badge>
                        {diagnosticData.accessRequests.filter((r: any) => r.status === 'rejected').length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métadonnées JWT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-2">App Metadata:</p>
                  <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto">
                    {JSON.stringify(diagnosticData.user.app_metadata, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">User Metadata:</p>
                  <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto">
                    {JSON.stringify(diagnosticData.user.user_metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertDescription className="text-xs">
              Diagnostic effectué le: {new Date(diagnosticData.timestamp).toLocaleString('fr-FR')}
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
