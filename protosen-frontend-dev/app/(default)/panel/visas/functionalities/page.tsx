import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const functionalities = [
  "Demande en ligne avec upload de documents",
  "Verification automatique des donnees",
  "Validation intelligente (algorithme + DPI)",
  "Notifications SMS/Email",
  "Alertes expiration et rejet",
  "Statistiques avancees",
  "Retrait electronique securise",
  "Bordereaux de retrait automatises",
];

export default function VisaFunctionalitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fonctionnalites cles</h1>
        <p className="text-sm text-muted-foreground">
          Liste des fonctionnalites definies dans le TDR de gestion des visas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalites TDR</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {functionalities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
