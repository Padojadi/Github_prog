import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const forms = [
  {
    href: "/panel/visas/forms/demande",
    title: "Formulaire - Demande de visa",
    description:
      "Nom, Prenom, Date de naissance, Nationalite, Numero passeport, Type de visa, Documents a fournir.",
  },
  {
    href: "/panel/visas/forms/validation",
    title: "Formulaire - Validation",
    description:
      "Numero dossier, Score automatique, Analyse DPI, Decision, Motif rejet.",
  },
  {
    href: "/panel/visas/forms/retrait",
    title: "Formulaire - Retrait",
    description:
      "Numero visa, Nom collecteur, Piece identite, Signature, Date retrait.",
  },
];

export default function VisaFormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Formulaires</h1>
        <p className="text-sm text-muted-foreground">
          Regroupement des formulaires Visa definis dans le TDR.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.href}>
            <CardHeader>
              <CardTitle className="text-base">{form.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{form.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={form.href}>Ouvrir</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
