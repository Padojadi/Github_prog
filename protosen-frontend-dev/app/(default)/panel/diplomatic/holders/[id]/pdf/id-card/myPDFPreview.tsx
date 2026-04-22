"use client";

import React, { useEffect, useRef } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { IPersonCardInfos } from "@/lib/types";
import IdCardPDF from "@/components/idCard/idCardPDF";
import { usePrintContext } from "@/app/print-context";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";
import { SystemSettings } from "@/features/settings/system-settings/types";

export default function MyPDFPreview({ holder, settings }: { holder: IPersonCardInfos, settings: SystemSettings }) {
  const {
    diplomaticEntity,
    printColor,
    OIText,
    photo,
    plaque,
    deliverDate,
    expirationDate,
    cardTitle,
  } = usePrintContext();
  const qrCodeData = holder.firstName + " " + holder.lastName;
  const [QRCodeString, setQRCodeString] = React.useState<string>("");
  const searchParams = useSearchParams();

  const isDuplicate = searchParams.has("duplicate_id");

  useEffect(() => {
    QRCode.toDataURL(qrCodeData, { margin: 0, color: { light: "#0000" } }).then(
      (data: any) => {
        setQRCodeString(data);
      }
    );
  }, []);

  return (
    <div className="flex justify-center">
      <PDFViewer width={1000} height={1000}>
        <IdCardPDF
          person={holder}
          bgColor={printColor}
          diplomaticEntity={diplomaticEntity}
          OIText={OIText}
          photo={photo}
          plaque={plaque}
          qrCode={QRCodeString}
          deliverDate={deliverDate}
          expirationDate={expirationDate}
          cardTitle={cardTitle}
          showWatermark={isDuplicate}
          settings={settings}
        />
      </PDFViewer>
    </div>
  );
}
