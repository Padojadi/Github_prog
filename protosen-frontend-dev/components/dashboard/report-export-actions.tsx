"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type DashboardReportSection,
  exportDashboardReportToExcel,
  exportDashboardReportToPdf,
} from "@/lib/dashboard-report-export";

type DashboardReportActionsProps = {
  title: string;
  fileName: string;
  sections: DashboardReportSection[];
  className?: string;
};

export function DashboardReportActions({
  title,
  fileName,
  sections,
  className,
}: DashboardReportActionsProps) {
  const hasExportableContent = sections.some(
    (section) => section.headers.length > 0
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!hasExportableContent}
        onClick={() => exportDashboardReportToExcel(fileName, sections)}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!hasExportableContent}
        onClick={() => exportDashboardReportToPdf(title, fileName, sections)}
      >
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
