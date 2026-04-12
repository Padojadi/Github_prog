import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Info,
  CheckCheck,
} from "lucide-react";
import { TConferenceStatus } from "../../types";

interface StatusBadgeProps {
  status: TConferenceStatus;
  reason?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const StatusBadge = ({
  status,
  className,
  size = "md",
  reason,
}: StatusBadgeProps) => {
  // Status configuration
  const statusConfig = {
    ACCEPTED: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      class: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30",
      label: "Acceptée",
    },
    VALIDATED: {
      icon: <CheckCheck className="w-3.5 h-3.5" />,
      class: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
      label: "Validée",
    },
    CONFIRMED: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      class: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
      label: "Confirmée",
    },
    PENDING: {
      icon: <Clock className="w-3.5 h-3.5" />,
      class: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      label: "En attente",
    },
    PUBLISHED: {
      icon: <Calendar className="w-3.5 h-3.5" />,
      class: "bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/30",
      label: "Publiée",
    },
    REJECTED: {
      icon: <XCircle className="w-3.5 h-3.5" />,
      class: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      label: "Rejetée",
    },
    REJECTED_PERMANENTLY: {
      icon: <XCircle className="w-3.5 h-3.5" />,
      class: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      label: "Rejetée définitivement",
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-all duration-300 text-sm",
        config.class,
        sizeClasses[size],
        className
      )}
    >
      {config.icon}
      <span className="truncate inline-block lg:max-w-[80px] xl:max-w-[100px]">
        {config.label}
      </span>
      {(status === "REJECTED" || status === "REJECTED_PERMANENTLY") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="">{reason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default StatusBadge;
