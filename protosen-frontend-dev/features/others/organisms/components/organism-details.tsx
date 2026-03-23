import { translateOrganismStatus } from "../lib/utils";
import { Organism } from "../types";

interface OrganismDetailsProps {
  organism: Organism;
}

export function OrganismDetails({ organism }: OrganismDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{organism.libelle}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Code:</h3>
        <p className="font-semibold text-foreground">{organism.code}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Type d&apos;institution:</h3>
        <p className="font-semibold text-foreground">
          {organism.institutionType}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Service:</h3>
        <p className="font-semibold text-foreground">{organism.service}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Statut:</h3>
        <p className="font-semibold text-foreground">
          {translateOrganismStatus(organism.status)}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Créé le:</h3>
        <p className="font-semibold text-foreground">{organism.createdAt}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Modifié le:</h3>
        <p className="font-semibold text-foreground">{organism.updatedAt}</p>
      </div>
    </div>
  );
}
