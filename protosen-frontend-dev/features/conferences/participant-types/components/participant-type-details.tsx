"use client";

import { ParticipantType } from "../types";

interface ParticipantTypeDetailsProps {
  participantType: ParticipantType;
}

export function ParticipantTypeDetails({
  participantType,
}: ParticipantTypeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{participantType.label}</p>
      </div>

      {participantType.description && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Description
          </h3>
          <p className="font-semibold text-foreground">
            {participantType.description}
          </p>
        </div>
      )}
    </div>
  );
}
