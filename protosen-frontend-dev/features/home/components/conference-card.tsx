import { Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Conference,
  ConferencePublicGetAll,
} from "@/features/conferences/types";
import StatusBadge from "@/features/conferences/components/conference-details/status-badge";
import Link from "next/link";
import { fr } from "date-fns/locale";

interface ConferenceCardProps {
  conference: ConferencePublicGetAll;
  className?: string;
}

export function ConferenceCardHome({
  conference,
  className,
}: ConferenceCardProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl relative isolate border border-border bg-gradient-card dark:bg-gradient-card-dark text-foreground card-hover transition-all duration-300",
        className
      )}
    >
      {/* <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        <StatusBadge
          status={conference.statusHistories[0].status}
          className="absolute top-3 right-3 z-20 shadow-sm"
        />
      </div> */}

      <div className="p-5">
        <h3 className="line-clamp-1 font-semibold text-lg mb-1 transition-colors group-hover:text-primary">
          <Link href={`/conferences/${conference.id}`}>
            <span className="absolute inset-0 z-10"></span>
            {conference.title}
          </Link>
        </h3>
        {/* 
        <p className="line-clamp-2 text-muted-foreground text-sm min-h-[40px]">
          {description}
        </p> */}

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {format(new Date(conference.startDate), "PPP", { locale: fr })} -{" "}
              {format(new Date(conference.endDate), "PPP", { locale: fr })}
            </span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="truncate">{conference.location}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{conference._count.participants ?? 0} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
}
