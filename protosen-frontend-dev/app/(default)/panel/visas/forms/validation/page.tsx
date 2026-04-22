import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VisaValidationFormEntryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulaire - Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Cette rubrique ouvre le formulaire de validation TDR:
          numero dossier, score automatique, analyse DPI, decision et motif rejet.
        </p>
        <Button asChild>
          <Link href="/panel/visas/validation">Ouvrir le formulaire</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/panel/visas/requests">Voir les dossiers à valider</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
