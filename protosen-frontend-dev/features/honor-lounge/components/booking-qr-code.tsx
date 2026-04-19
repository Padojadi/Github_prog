"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BookingQrCodeProps = {
  qrCodeData: string;
  bookingId: string;
};

type ParsedQrPayload = {
  booking_id?: string;
  lounge_name?: string;
  lounge_location?: string;
  customer_name?: string;
  start_time?: string;
  end_time?: string;
  num_guests?: number;
  total_amount?: number;
  amenities?: string[];
};

export function BookingQrCode({ qrCodeData, bookingId }: BookingQrCodeProps) {
  const parsed = useMemo<ParsedQrPayload | null>(() => {
    try {
      return JSON.parse(qrCodeData) as ParsedQrPayload;
    } catch {
      return null;
    }
  }, [qrCodeData]);

  const handleDownload = () => {
    const svg = document.getElementById(`booking-qr-${bookingId}`);
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode-reservation-${bookingId}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code de réservation</CardTitle>
        <CardDescription>
          Présentez ce QR code à l&apos;entrée du salon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg flex justify-center">
          <QRCodeSVG id={`booking-qr-${bookingId}`} value={qrCodeData} size={260} />
        </div>

        {parsed ? (
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Salon:</span>{" "}
              {parsed.lounge_name || "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Client:</span>{" "}
              {parsed.customer_name || "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Début:</span>{" "}
              {parsed.start_time ? new Date(parsed.start_time).toLocaleString("fr-FR") : "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Fin:</span>{" "}
              {parsed.end_time ? new Date(parsed.end_time).toLocaleString("fr-FR") : "-"}
            </p>
          </div>
        ) : null}

        <Button type="button" variant="outline" className="w-full" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger le QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
