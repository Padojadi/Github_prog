"use client";

import { SupportCategory } from "../types";

interface SupportCategoryDetailsProps {
  supportCategory: SupportCategory;
}

export function SupportCategoryDetails({
  supportCategory,
}: SupportCategoryDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Libellé:</h3>
        <p className="font-semibold text-foreground">{supportCategory.label}</p>
      </div>
    </div>
  );
}
