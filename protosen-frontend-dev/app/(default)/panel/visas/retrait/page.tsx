import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function VisaRetraitPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Retrait électronique sécurisé</h1>
        <p className="text-sm text-muted-foreground">
          Formulaire de retrait conformément au TDR (Section 8).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire - Retrait</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="numeroVisa">Numéro visa</Label>
              <Input id="numeroVisa" name="numeroVisa" placeholder="VISA-2026-0001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomCollecteur">Nom collecteur</Label>
              <Input id="nomCollecteur" name="nomCollecteur" placeholder="Nom du collecteur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pieceIdentite">Pièce identité</Label>
              <Input id="pieceIdentite" name="pieceIdentite" placeholder="N° CNI / Passeport" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRetrait">Date retrait</Label>
              <Input id="dateRetrait" name="dateRetrait" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature">Signature</Label>
            <Input id="signature" name="signature" placeholder="Nom et signature du collecteur" />
          </div>

          <div className="flex justify-end">
            <Button type="button">Valider le retrait</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
