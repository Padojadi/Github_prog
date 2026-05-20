import { cn, formatDateFnsTimelineLocale } from "@/lib/utils";
import { format } from "date-fns";
import { CircleIcon } from "lucide-react";
import {
  StatusHistoryChangedBy,
  TConferenceRegistrationStatus,
} from "../../types";
import StatusBadgeRegistration from "./status-badge-registration";

export interface TimelineItem {
  id: string;
  status: TConferenceRegistrationStatus;
  changedAt: string;
  changedBy: StatusHistoryChangedBy;
  rejectionReason?: string | null;
}

interface TimelineRegistrationProps {
  items: TimelineItem[];
  className?: string;
  compact?: boolean;
}

const TimelineRegistration = ({
  items,
  className,
  compact = false,
}: TimelineRegistrationProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-start group">
          {/* Vertical line */}
          {index < items.length - 1 && (
            <div className="absolute top-6 left-3 bottom-[-24px] w-px bg-border group-hover:bg-primary/50 transition-colors duration-300" />
          )}

          {/* Timeline item */}
          <div className="flex flex-col items-center mr-4">
            <div
              className={cn(
                "rounded-full p-1.5 border-2 transition-all duration-300",
                item.status === "PAID"
                  ? "border-green-500 text-green-500"
                  : item.status === "PROCESSING"
                  ? "border-yellow-500 text-yellow-500"
                  : item.status === "PENDING_PAYMENT"
                  ? "border-cyan-500 text-cyan-500"
                  : item.status === "REFUNDED"
                  ? "border-blue-500 text-blue-500"
                  : "border-red-500 text-red-500"
              )}
            >
              <CircleIcon className="h-2 w-2 fill-current" />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <StatusBadgeRegistration
                status={item.status}
                reason={item.rejectionReason || ""}
              />
              <time className="text-xs text-muted-foreground">
                {formatDateFnsTimelineLocale(item.changedAt)}
              </time>
            </div>

            {!compact && (item.changedBy || item.rejectionReason) && (
              <div className="bg-muted rounded-md p-3 mt-2 group-hover:bg-muted/80 transition-colors duration-300">
                {item.changedBy && (
                  <p className="text-sm font-medium">
                    Changé par: {item.changedBy.lastName}{" "}
                    {item.changedBy.firstName}
                  </p>
                )}
                {item.rejectionReason && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineRegistration;
