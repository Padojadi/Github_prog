"use client";
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
} from "lucide-react";
import { TConferenceRegistrationStatus } from "../../types";
import { RiRefundLine } from "react-icons/ri";

interface StatusBadgeProps {
  status: TConferenceRegistrationStatus;
  reason?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const StatusBadgeRegistration = ({
  status,
  className,
  size = "md",
  reason,
}: StatusBadgeProps) => {
  // Status configuration
  const statusConfig = {
    PROCESSING: {
      icon: <Clock className="w-3.5 h-3.5" />,
      class: "bg-[#eab308]/15 text-[#eab308] border-[#eab308]/30",
      label: "En cours de traitement",
    },
    PAID: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      class: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
      label: "Payée",
    },
    PENDING_PAYMENT: {
      icon: <Clock className="w-3.5 h-3.5" />,
      class: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      label: "Paiement en attente",
    },
    REFUNDED: {
      icon: <RiRefundLine className="w-3.5 h-3.5" />,
      class: "bg-[#0ea5e9]/15 text-[#0ea5e9] border-[#0ea5e9]/30",
      label: "Remboursée",
    },
    REJECTED: {
      icon: <XCircle className="w-3.5 h-3.5" />,
      class: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      label: "Rejetée",
    },
    CANCELLED: {
      icon: <XCircle className="w-3.5 h-3.5" />,
      class: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      label: "Paiement annulé",
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-all duration-300 text-sm truncate",
        config.class,
        sizeClasses[size],
        className
      )}
    >
      {config.icon}
      <span className="truncate inline-block lg:max-w-[80px] xl:max-w-[100px]">
        {config.label}
      </span>
      {(status === "REJECTED" || status === "CANCELLED") && (
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
    </span>
  );
};

export default StatusBadgeRegistration;
