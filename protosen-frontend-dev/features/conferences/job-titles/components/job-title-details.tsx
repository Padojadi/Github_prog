"use client";

import { JobTitle } from "../types";

interface JobTitleDetailsProps {
  jobTitle: JobTitle;
}

export function JobTitleDetails({ jobTitle }: JobTitleDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{jobTitle.name}</p>
      </div>
    </div>
  );
}
