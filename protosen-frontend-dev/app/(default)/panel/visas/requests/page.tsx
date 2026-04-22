import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VisaRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes de visa</h1>
        <p className="text-sm text-muted-foreground">
          Workflow TDR: soumission, vérification automatique, validation DPCT, notification, émission, retrait.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette rubrique affichera les demandes soumises avec leurs statuts de traitement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
