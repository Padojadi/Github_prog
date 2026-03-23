'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function TestCorsPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>({})

  const runTests = async () => {
    setTesting(true)
    const testResults: any = {}

    try {
      testResults.origin = window.location.origin
      testResults.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      testResults.sessionCheck = {
        success: !sessionError && !!session,
        error: sessionError?.message,
        userId: session?.user?.id,
        userRole: session?.user?.app_metadata?.user_role,
        email: session?.user?.email,
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${session?.access_token}`,
          },
        })
        testResults.restApiCheck = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        }
      } catch (err: any) {
        testResults.restApiCheck = {
          success: false,
          error: err.message,
          isCorsError: err.message.includes('CORS') || err.message.includes('Failed to fetch'),
        }
      }

      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .limit(5)

        testResults.profilesQuery = {
          success: !profilesError,
          error: profilesError?.message,
          count: profiles?.length || 0,
          data: profiles,
        }
      } catch (err: any) {
        testResults.profilesQuery = {
          success: false,
          error: err.message,
        }
      }

      try {
        const { data: requests, error: requestsError } = await supabase
          .from('access_requests')
          .select('id, status, created_at, profile:user_id(id, email, full_name)')
          .eq('status', 'pending')
          .limit(5)

        testResults.accessRequestsQuery = {
          success: !requestsError,
          error: requestsError?.message,
          errorCode: requestsError?.code,
          errorDetails: requestsError?.details,
          count: requests?.length || 0,
          data: requests,
          allHaveProfiles: requests?.every((r: any) => r.profile) || false,
        }
      } catch (err: any) {
        testResults.accessRequestsQuery = {
          success: false,
          error: err.message,
        }
      }

      try {
        const { count, error: countError } = await supabase
          .from('access_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        testResults.accessRequestsCount = {
          success: !countError,
          error: countError?.message,
          count: count || 0,
        }
      } catch (err: any) {
        testResults.accessRequestsCount = {
          success: false,
          error: err.message,
        }
      }

      try {
        const { data: rawRequests, error: rawError } = await supabase
          .from('access_requests')
          .select('*')
          .eq('status', 'pending')
          .limit(10)

        testResults.rawAccessRequests = {
          success: !rawError,
          error: rawError?.message,
          count: rawRequests?.length || 0,
          data: rawRequests,
        }
      } catch (err: any) {
        testResults.rawAccessRequests = {
          success: false,
          error: err.message,
        }
      }

    } catch (err: any) {
      testResults.globalError = err.message
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <AlertCircle className="h-5 w-5 text-gray-400" />
    if (success) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean | undefined) => {
    if (success === undefined) return <Badge variant="secondary">Non testé</Badge>
    if (success) return <Badge className="bg-green-500">Succès</Badge>
    return <Badge variant="destructive">Échec</Badge>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Test CORS & Diagnostic</h1>
        <p className="text-muted-foreground mt-2">
          Testez la connectivité et diagnostiquez les problèmes CORS/RLS
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lancer les tests</CardTitle>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour tester toutes les connexions Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={testing}>
            {testing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              'Lancer les tests'
            )}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Environnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Origine actuelle</p>
                <code className="text-xs bg-muted p-2 rounded block mt-1 break-all">
                  {results.origin}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium">URL Supabase</p>
                <code className="text-xs bg-muted p-2 rounded block mt-1 break-all">
                  {results.supabaseUrl}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>1. Session Utilisateur</CardTitle>
                {getStatusBadge(results.sessionCheck?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <code className="text-xs">{String(results.sessionCheck?.userId || 'N/A')}</code>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <code className="text-xs">{String(results.sessionCheck?.email || 'N/A')}</code>
                </div>
                <div>
                  <p className="text-sm font-medium">Rôle (JWT)</p>
                  <code className="text-xs">
                    {typeof results.sessionCheck?.userRole === 'object'
                      ? JSON.stringify(results.sessionCheck?.userRole)
                      : String(results.sessionCheck?.userRole || 'NON SYNCHRONISÉ')}
                  </code>
                </div>
              </div>
              {results.sessionCheck?.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                  <p className="text-sm text-red-800">{String(results.sessionCheck.error)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>2. API REST Supabase</CardTitle>
                {getStatusBadge(results.restApiCheck?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.restApiCheck?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">API accessible (Status: {String(results.restApiCheck.status)})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ✅ CORS est correctement configuré pour cette origine
                  </p>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {results.restApiCheck?.isCorsError
                        ? '🔴 ERREUR CORS DÉTECTÉE'
                        : 'Erreur API'}
                    </span>
                  </div>
                  <p className="text-sm text-red-800">{String(results.restApiCheck?.error)}</p>
                  {results.restApiCheck?.isCorsError && (
                    <div className="mt-3 p-3 bg-white rounded border border-red-300">
                      <p className="text-sm font-semibold text-red-900 mb-2">
                        Action requise : Configurer CORS dans Supabase
                      </p>
                      <ol className="text-xs text-red-800 space-y-1 list-decimal list-inside">
                        <li>Ouvrez votre Dashboard Supabase</li>
                        <li>Allez dans Authentication → URL Configuration</li>
                        <li>Ajoutez cette origine dans Redirect URLs :</li>
                      </ol>
                      <code className="text-xs bg-red-100 p-2 rounded block mt-2 break-all">
                        {results.origin}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>3. Requête Profiles (SELECT)</CardTitle>
                {getStatusBadge(results.profilesQuery?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.profilesQuery?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{String(results.profilesQuery.count)} profils chargés</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ✅ Les politiques RLS permettent la lecture des profils
                  </p>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-800">{String(results.profilesQuery?.error)}</p>
                  <p className="text-xs text-red-700 mt-2">
                    ❌ Problème RLS : Les politiques bloquent l'accès aux profils
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>4. Comptage Demandes en Attente</CardTitle>
                {getStatusBadge(results.accessRequestsCount?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.accessRequestsCount?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {String(results.accessRequestsCount.count)} demande(s) en attente trouvée(s)
                    </span>
                  </div>
                  {results.accessRequestsCount.count === 0 && (
                    <p className="text-xs text-muted-foreground">
                      ℹ️ Aucune demande en attente dans la base de données
                    </p>
                  )}
                  {results.accessRequestsCount.count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ✅ Les demandes existent mais le problème est dans la jointure profiles
                    </p>
                  )}
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-800">{String(results.accessRequestsCount?.error)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>5. Requête Demandes (sans JOIN)</CardTitle>
                {getStatusBadge(results.rawAccessRequests?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.rawAccessRequests?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {String(results.rawAccessRequests.count)} demande(s) chargée(s)
                    </span>
                  </div>
                  {results.rawAccessRequests.count > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Demandes trouvées :</p>
                      <div className="bg-muted p-3 rounded text-xs">
                        <pre className="overflow-auto">
                          {JSON.stringify(results.rawAccessRequests.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-800">{String(results.rawAccessRequests?.error)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>6. Requête Demandes (avec JOIN profiles)</CardTitle>
                {getStatusBadge(results.accessRequestsQuery?.success)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.accessRequestsQuery?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {String(results.accessRequestsQuery.count)} demande(s) avec profil chargée(s)
                    </span>
                  </div>
                  {!results.accessRequestsQuery.allHaveProfiles && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Certaines demandes n'ont pas de profil associé (problème RLS)
                      </p>
                    </div>
                  )}
                  {results.accessRequestsQuery.count > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Demandes avec profils :</p>
                      <div className="bg-muted p-3 rounded text-xs">
                        <pre className="overflow-auto">
                          {JSON.stringify(results.accessRequestsQuery.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Erreur lors de la jointure</span>
                  </div>
                  <p className="text-sm text-red-800 mb-2">{String(results.accessRequestsQuery?.error)}</p>
                  {results.accessRequestsQuery?.errorCode && (
                    <p className="text-xs text-red-700">Code: {String(results.accessRequestsQuery.errorCode)}</p>
                  )}
                  {results.accessRequestsQuery?.errorDetails && (
                    <p className="text-xs text-red-700">Détails: {String(results.accessRequestsQuery.errorDetails)}</p>
                  )}
                  <div className="mt-3 p-3 bg-white rounded border border-red-300">
                    <p className="text-sm font-semibold text-red-900 mb-2">
                      Diagnostic :
                    </p>
                    <p className="text-xs text-red-800">
                      Le problème vient probablement des politiques RLS qui bloquent la jointure avec la table profiles.
                      Vérifiez que votre JWT contient le bon rôle (user_role = 'administrator').
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Résumé & Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!results.restApiCheck?.success && results.restApiCheck?.isCorsError && (
                <div className="bg-red-100 border border-red-300 rounded p-3">
                  <p className="text-sm font-semibold text-red-900 mb-1">🔴 Problème principal : CORS</p>
                  <p className="text-xs text-red-800">
                    Votre origine n'est pas autorisée dans Supabase. Suivez les instructions dans le Test #2 ci-dessus.
                  </p>
                </div>
              )}

              {results.restApiCheck?.success && !results.sessionCheck?.userRole && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">⚠️ Problème : JWT non synchronisé</p>
                  <p className="text-xs text-yellow-800">
                    Votre session n'a pas de user_role dans le JWT. Cliquez sur "Rafraîchir session" dans la page Demandes en attente.
                  </p>
                </div>
              )}

              {results.restApiCheck?.success &&
               results.sessionCheck?.userRole &&
               results.accessRequestsCount?.success &&
               results.accessRequestsCount?.count > 0 &&
               results.accessRequestsQuery?.count === 0 && (
                <div className="bg-red-100 border border-red-300 rounded p-3">
                  <p className="text-sm font-semibold text-red-900 mb-1">🔴 Problème : RLS bloque la jointure profiles</p>
                  <p className="text-xs text-red-800 mb-2">
                    Les demandes existent ({String(results.accessRequestsCount.count)} trouvées) mais les politiques RLS
                    bloquent la jointure avec la table profiles.
                  </p>
                  <p className="text-xs text-red-800">
                    Solution : Vérifiez que votre JWT contient user_role = 'administrator' et que les politiques
                    RLS de profiles autorisent les administrateurs à lire tous les profils.
                  </p>
                </div>
              )}

              {results.restApiCheck?.success &&
               results.sessionCheck?.userRole &&
               results.accessRequestsQuery?.success &&
               results.accessRequestsQuery?.count > 0 && (
                <div className="bg-green-100 border border-green-300 rounded p-3">
                  <p className="text-sm font-semibold text-green-900 mb-1">✅ Tout fonctionne correctement !</p>
                  <p className="text-xs text-green-800">
                    Les demandes sont visibles et accessibles. Le problème devrait être résolu dans la page "Demandes en attente".
                  </p>
                </div>
              )}

              {results.restApiCheck?.success &&
               results.sessionCheck?.userRole &&
               results.accessRequestsCount?.success &&
               results.accessRequestsCount?.count === 0 && (
                <div className="bg-blue-100 border border-blue-300 rounded p-3">
                  <p className="text-sm font-semibold text-blue-900 mb-1">ℹ️ Aucune demande en attente</p>
                  <p className="text-xs text-blue-800">
                    Il n'y a actuellement aucune demande en attente dans la base de données.
                    Si vous pensez qu'il devrait y en avoir, vérifiez que les demandes n'ont pas été traitées ou que le status est bien 'pending'.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
