import { ConferenceHotel } from "../../types";

interface AccommodationDetailsProps {
  accommodation: ConferenceHotel;
}

export function AccommodationDetails({
  accommodation,
}: AccommodationDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{accommodation.name}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Email:</h3>
        <p className="font-semibold text-foreground">{accommodation.email}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Téléphone:</h3>
        <p className="font-semibold text-foreground">{accommodation.phone}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Adresse:</h3>
        <p className="font-semibold text-foreground">
          {accommodation.location}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Géolocalisation:</h3>
        <p className="font-semibold text-foreground">
          <a
            href={accommodation.geolocation ? accommodation.geolocation : "#"}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {accommodation.geolocation ?? "N/A"}
          </a>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Lien de réservation:</h3>
        <p className="font-semibold text-foreground">
          <a
            href={
              accommodation.reservationLink
                ? accommodation.reservationLink
                : "#"
            }
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {accommodation.reservationLink ?? "N/A"}
          </a>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Créé le:</h3>
        <p className="font-semibold text-foreground">
          {accommodation.createdAt}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Modifié le:</h3>
        <p className="font-semibold text-foreground">
          {accommodation.updatedAt}
        </p>
      </div>
    </div>
  );
}
