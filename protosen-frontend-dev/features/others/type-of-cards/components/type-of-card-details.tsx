import { CardType } from "../types";

interface CardTypeDetailsProps {
  cardType: CardType;
}

export function CardTypeDetails({ cardType }: CardTypeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{cardType.name}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Observations:</h3>
        <ul className="list-disc pl-5">
          {cardType.observation.map((observation, index) => (
            <li
              key={`observation-${index}`}
              className="font-semibold text-foreground"
            >
              {observation}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Description:</h3>
        <p className="font-semibold text-foreground">
          {cardType.description || ""}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Couleur:</h3>
        <div className="w-full h-4 rounded-md" style={{ backgroundColor: cardType.color || "" }}></div>
      </div>
    </div>
  );
}
