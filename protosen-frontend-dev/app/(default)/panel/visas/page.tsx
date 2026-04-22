import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VisasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Visa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Module Visa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Le module Visa est activé dans la barre latérale.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
