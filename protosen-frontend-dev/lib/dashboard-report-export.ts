"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type ReportCell = string | number | boolean | null | undefined;

export type DashboardReportSection = {
  title: string;
  headers: string[];
  rows: ReportCell[][];
};

const normalizeCell = (value: ReportCell): string | number => {
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (value === null || value === undefined) return "";
  return String(value);
};

const sanitizeSheetName = (title: string, fallbackIndex: number): string => {
  const sanitized = title.replace(/[\\/*?:[\]]/g, " ").trim();
  if (!sanitized) return `Rapport ${fallbackIndex + 1}`;
  return sanitized.slice(0, 31);
};

const buildReportFilename = (baseName: string, extension: "xlsx" | "pdf"): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${baseName}-${timestamp}.${extension}`;
};

export const exportDashboardReportToExcel = (
  baseName: string,
  sections: DashboardReportSection[]
) => {
  const workbook = XLSX.utils.book_new();

  sections.forEach((section, index) => {
    const normalizedRows = section.rows.map((row) => row.map(normalizeCell));
    const hasRows = normalizedRows.length > 0;
    const worksheetData: Array<Array<string | number>> = [
      [section.title],
      [],
      section.headers,
      ...(hasRows ? normalizedRows : [["Aucune donnee"]]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const columnWidths = section.headers.map((header, colIndex) => {
      const maxRowWidth = normalizedRows.reduce((max, row) => {
        const cellValue = row[colIndex];
        return Math.max(max, String(cellValue ?? "").length);
      }, 0);

      return { wch: Math.max(String(header).length, maxRowWidth, 14) };
    });

    worksheet["!cols"] = columnWidths.length ? columnWidths : [{ wch: 20 }];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sanitizeSheetName(section.title, index)
    );
  });

  XLSX.writeFile(workbook, buildReportFilename(baseName, "xlsx"));
};

export const exportDashboardReportToPdf = (
  title: string,
  baseName: string,
  sections: DashboardReportSection[]
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  doc.setFontSize(16);
  doc.text(title, 40, 40);
  doc.setFontSize(9);
  doc.text(`Genere le ${new Date().toLocaleString("fr-FR")}`, 40, 58);

  sections.forEach((section, index) => {
    if (index > 0) {
      doc.addPage();
    }

    doc.setFontSize(12);
    doc.text(section.title, 40, 86);

    const body = section.rows.map((row) => row.map((cell) => normalizeCell(cell)));

    autoTable(doc, {
      startY: 100,
      head: [section.headers],
      body: body.length > 0 ? body : [["Aucune donnee"]],
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [30, 64, 175],
      },
      margin: {
        left: 40,
        right: 40,
      },
    });
  });

  doc.save(buildReportFilename(baseName, "pdf"));
};
