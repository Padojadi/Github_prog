import { cn } from "@/lib/utils";
import {
  MapPin,
  Phone,
  Globe,
  Star,
  Check,
  Mail,
  MapPinned,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ConferenceHotel } from "../../types";

interface HotelCardProps {
  accommodation: ConferenceHotel;
  canSelectAccommodation: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onChangeAccommodation?: (id: string) => void;
  className?: string;
  disabled?: boolean;
}

const HotelCard = ({
  accommodation,
  canSelectAccommodation,
  isSelected = false,
  onSelect,
  onRemove,
  onChangeAccommodation,
  className,
  disabled,
}: HotelCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl flex flex-col relative border h-full overflow-hidden bg-white border-border dark:bg-slate-950 transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      {/* <div className=" h-40">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        {isRecommended && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Recommended
          </div>
        )}
      </div> */}

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{accommodation.name}</h3>
          {isSelected && (
            <div className=" bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Sélectionné
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="inline-block -mt-1">{accommodation.location}</span>
          </div>

          <div className="flex items-start">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="inline-block -mt-1">{accommodation.email}</span>
          </div>

          <div className="flex items-start">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="inline-block -mt-1">{accommodation.phone}</span>
          </div>

          <div className="flex items-start">
            <MapPinned className="h-4 w-4 mr-2 flex-shrink-0" />
            <a
              href={accommodation.geolocation ? accommodation.geolocation : "#"}
              target="_blank"
              className="text-blue-600 hover:underline -mt-1 inline-block"
            >
              {accommodation.geolocation ?? "N/A"}
            </a>
          </div>
          <div className="flex items-start">
            <Link className="h-4 w-4 mr-2 flex-shrink-0" />
            <a
              href={
                accommodation.reservationLink
                  ? accommodation.reservationLink
                  : "#"
              }
              target="_blank"
              className="text-blue-600 hover:underline -mt-1 inline-block"
            >
              {accommodation.reservationLink ?? "N/A"}
            </a>
          </div>
        </div>
      </div>
      <div className="pt-2 mt-auto pb-6 px-6">
        {onRemove && canSelectAccommodation && isSelected && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                disabled={disabled}
                className="w-full"
              >
                Retirer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Retirer des hébergements?</AlertDialogTitle>
                <AlertDialogDescription>
                  {`Voulez vous retirer ${accommodation.name} de la liste d'hébergements pour la conférence?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(accommodation.id)}>
                  Confimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {onSelect && canSelectAccommodation && !isSelected && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"outline"}
                disabled={disabled}
                className="w-full"
              >
                Ajouter aux hébergements
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ajouter aux hébergements?</AlertDialogTitle>
                <AlertDialogDescription>
                  {`Voulez vous ajouter ${accommodation.name} à la liste d'hébergements pour la conférence?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onSelect(accommodation.id)}>
                  Confimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {onChangeAccommodation && canSelectAccommodation && !isSelected && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"outline"}
                disabled={disabled}
                className="w-full"
              >
                Choisir cet hébergement
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Changer pour cet hébergement?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {`Voulez vous definir ${accommodation.name} comme votre hébergement?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onChangeAccommodation(accommodation.id)}
                >
                  Confimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default HotelCard;
