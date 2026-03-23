'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, Copy } from "lucide-react"
import { toast } from "sonner"

interface CorsHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CorsHelpDialog({ open, onOpenChange }: CorsHelpDialogProps) {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('URL copiée dans le presse-papiers !')
    } catch (err) {
      toast.error('Impossible de copier l\'URL')
    }
  }

  const copyAllPatterns = async () => {
    const patterns = [
      'https://*.webcontainer-api.io/**',
      'https://*.local-credentialless.webcontainer-api.io/**',
      'http://localhost:3000/**'
    ].join('\n')
    await copyToClipboard(patterns)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Configuration CORS Requise</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Votre projet Supabase bloque les requêtes depuis cette origine. Suivez ces étapes pour résoudre le problème :
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Accéder au Dashboard Supabase
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              Ouvrez{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                supabase.com/dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
              {' '}et sélectionnez votre projet
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Configurer les URLs Autorisées
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              Allez dans <strong>Authentication</strong> → <strong>URL Configuration</strong>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Ajouter ces URLs
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Dans le champ <strong>Redirect URLs</strong>, ajoutez les patterns suivants :
              </p>
              <div className="bg-muted p-3 rounded-md text-xs font-mono space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <code>https://*.webcontainer-api.io/**</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <code>https://*.local-credentialless.webcontainer-api.io/**</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <code>http://localhost:3000/**</code>
                </div>
              </div>
              <Button
                onClick={copyAllPatterns}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier tous les patterns
              </Button>
              {currentOrigin && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-1">
                    Ou ajoutez uniquement l'origine actuelle :
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-xs font-mono break-all">{currentOrigin}</code>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(currentOrigin)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier l'origine actuelle
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Sauvegarder et Actualiser
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              Cliquez sur <strong>Save</strong>, attendez 30 secondes, puis actualisez cette page
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-4">
            <p className="text-sm mb-2">
              <strong>Note :</strong> Pour plus de détails, consultez le fichier{' '}
              <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">GUIDE_CORS_SUPABASE.md</code>{' '}
              à la racine du projet.
            </p>
            <p className="text-sm">
              Si le problème persiste après configuration CORS,{' '}
              <a
                href="/admin/test-cors"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                onClick={() => window.location.href = '/admin/test-cors'}
              >
                utilisez l'outil de diagnostic avancé
              </a>
              {' '}pour identifier la cause exacte.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir Supabase Dashboard
          </Button>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Fermer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
