"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import { IHolder } from "@/lib/types";

export default function MyPDFPreview({ holder }: { holder: IHolder }) {
  return (
    <div className="flex justify-center">
      <PDFViewer width={1000} height={1000}>
        <PDFDocument holder={holder} />
      </PDFViewer>
    </div>
  );
}
