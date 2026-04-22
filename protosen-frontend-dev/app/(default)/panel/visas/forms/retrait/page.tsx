import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VisaRetraitFormMenuPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulaire - Retrait</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Cette rubrique correspond au formulaire de retrait du TDR:
          numero visa, nom collecteur, piece identite, signature, date retrait.
        </p>
        <Button asChild>
          <Link href="/panel/visas/retrait">Ouvrir le formulaire de retrait</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
