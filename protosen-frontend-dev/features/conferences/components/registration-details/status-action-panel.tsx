import {
  RegistrationStatusHistory,
  TConferenceRegistrationStatus,
} from "../../types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import Timeline from "./timeline";
import StatusBadgeRegistration from "./status-badge-registration";
import { AcceptRegistrationDialog } from "../registrations/accept-registration";
import { RejectRegistrationDialog } from "../registrations/reject-conference-registration";

interface StatusActionPanelRegistrationProps {
  registrationId: string;
  currentStatus: TConferenceRegistrationStatus;
  statusHistory: RegistrationStatusHistory[];
  // onViewFullHistory: () => void;
  // canAccept: boolean;
  // canConfirm: boolean;
  // canReject: boolean;
  // canRejectPermanently: boolean;
  reason?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StatusActionPanelRegistration = ({
  registrationId,
  currentStatus,
  statusHistory,
  // onViewFullHistory,
  // canAccept,
  // canConfirm,
  // canReject,
  reason,
  className,
  style,
}: StatusActionPanelRegistrationProps) => {
  const currentUser = useCurrentUser();

  const canViewActions = hasPermission(
    currentUser.accessGroup?.permissions || [],
    ["MANAGE_CONFERENCES"]
  );

  const canPerformActions =
    hasPermission(currentUser.accessGroup?.permissions || [], [
      "MANAGE_CONFERENCES",
    ]) && currentStatus === "PROCESSING";

  return (
    <div className={className} style={style}>
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Statut</h3>
          <StatusBadgeRegistration
            className=""
            status={currentStatus}
            reason={reason}
            size="md"
          />
        </div>

        <div className="border-t border-border border-b py-4">
          <Timeline items={statusHistory} compact />

          {/* {statusHistory.length > 3 && (
            <div className="mt-3 text-center">
              <Button
                variant="link"
                onClick={onViewFullHistory}
                size="sm"
                className="text-muted-foreground"
              >
                Voir tout l&apos;historique
              </Button>
            </div>
          )} */}
        </div>

        {canViewActions && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {canPerformActions && (
                <AcceptRegistrationDialog
                  id={registrationId}
                  disabled={!canPerformActions}
                />
              )}

              {canPerformActions && (
                <RejectRegistrationDialog
                  id={registrationId}
                  disabled={!canPerformActions}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusActionPanelRegistration;
