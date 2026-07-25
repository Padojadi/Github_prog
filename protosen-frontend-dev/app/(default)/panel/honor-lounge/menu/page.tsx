"use client";

import { ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HONOR_LOUNGE_MENU_URL =
  "https://protosen.2ticglobal.com/salon-honneur/menu/Menu_Salon_Honneur_Diass.pdf";
const HONOR_LOUNGE_MENU_QR_PDF_URL =
  "https://protosen.2ticglobal.com/salon-honneur/menu/Menu_Salon_Honneur_QR.pdf";

export default function HonorLoungeMenuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menu</h1>
        <p className="text-sm text-muted-foreground">
          Scannez le QR code pour ouvrir le menu du salon d&apos;honneur.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-white p-4">
            <QRCodeSVG value={HONOR_LOUNGE_MENU_URL} size={220} />
          </div>
          <p className="text-sm font-semibold text-foreground">Le Menu</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={HONOR_LOUNGE_MENU_URL} target="_blank" rel="noreferrer">
                Ouvrir le menu
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={HONOR_LOUNGE_MENU_QR_PDF_URL} target="_blank" rel="noreferrer">
                Ouvrir le QR en PDF
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
