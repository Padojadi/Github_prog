'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isSupabaseConfigError = error.message.includes('supabase') ||
                                 error.message.includes('URL') ||
                                 error.message.includes('Key')

  if (isSupabaseConfigError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Configuration requise</CardTitle>
            </div>
            <CardDescription>
              Les variables d'environnement Supabase ne sont pas configurées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900 font-medium mb-2">
                Pour l'administrateur du site :
              </p>
              <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                <li>Accédez à votre dashboard Netlify</li>
                <li>Allez dans Site configuration → Environment variables</li>
                <li>Ajoutez les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>Redéployez le site</li>
              </ol>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Consultez le fichier <code className="bg-slate-100 px-1 py-0.5 rounded">DEPLOYMENT.md</code> pour plus de détails.</p>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir la page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Une erreur est survenue</CardTitle>
          </div>
          <CardDescription>
            Désolé, quelque chose s'est mal passé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900 font-mono">
              {error.message || 'Erreur inconnue'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={reset}
              className="flex-1"
              variant="outline"
            >
              Réessayer
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
