import { NextRequest, NextResponse } from "next/server";
import {
  DashboardModuleKey,
  exportModuleCsv,
} from "@/lib/dashboard/general-dashboard";

const ALLOWED_MODULES: DashboardModuleKey[] = [
  "missions",
  "cards",
  "visas",
  "exonerations",
  "conferences",
  "immatriculations",
  "lounge",
  "others",
];

export async function GET(req: NextRequest) {
  const moduleParam = req.nextUrl.searchParams.get("module");

  if (!moduleParam || !ALLOWED_MODULES.includes(moduleParam as DashboardModuleKey)) {
    return NextResponse.json(
      {
        message:
          "Le paramètre `module` est obligatoire (missions, cards, visas, exonerations, conferences, immatriculations, lounge, others).",
      },
      { status: 400 },
    );
  }

  try {
    const { fileName, buffer } = await exportModuleCsv(moduleParam as DashboardModuleKey);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la génération du fichier d'export." },
      { status: 500 },
    );
  }
}
