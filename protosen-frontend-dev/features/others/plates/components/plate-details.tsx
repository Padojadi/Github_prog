import { TPlate } from "../types";

interface PlateDetailsProps {
  plate: TPlate;
}

export function PlateDetails({ plate }: PlateDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{plate.title}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Code:</h3>
        <p className="font-semibold text-foreground">{plate.code || ""}</p>
      </div>
    </div>
  );
}
