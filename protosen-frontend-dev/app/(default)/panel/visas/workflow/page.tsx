import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflowSteps = [
  "Soumission demande",
  "Verification automatique",
  "Validation DPCT",
  "Notification",
  "Emission visa",
  "Retrait",
];

export default function VisaWorkflowPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Workflow Visa</h1>
        <p className="text-sm text-muted-foreground">
          Etapes de traitement conformes au TDR.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flux de traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
