import { Button } from "@/components/ui/button";
import { StatusHistory, TConferenceStatus } from "../../types";
import StatusBadge from "./status-badge";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import { AcceptConferenceDialog } from "../new-requests/accept-conference-dialog";
import { RejectConferenceDialog } from "../new-requests/reject-conference-dialog";
import Timeline from "./timeline";
import { ValidateConferenceDialog } from "../new-requests/validate-conference-dialog";

interface StatusActionPanelProps {
  conferenceId: string;
  currentStatus: TConferenceStatus;
  statusHistory: StatusHistory[];
  onViewFullHistory: () => void;
  canAccept: boolean;
  canValidate: boolean;
  canConfirm: boolean;
  canReject: boolean;
  canRejectPermanently: boolean;
  reason?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StatusActionPanel = ({
  conferenceId,
  currentStatus,
  statusHistory,
  onViewFullHistory,
  canAccept,
  canValidate,
  canConfirm,
  canReject,
  canRejectPermanently,
  reason,
  className,
  style,
}: StatusActionPanelProps) => {
  const currentUser = useCurrentUser();

  const canViewActions = hasPermission(
    currentUser.accessGroup?.permissions || [],
    [
      "VALIDATE_CONFERENCE_REQUEST",
      "CONFIRM_CONFERENCE_REQUEST",
      "ACCEPT_CONFERENCE_REQUEST",
      "MANAGE_CONFERENCES",
    ]
  );

  return (
    <div className={className} style={style}>
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Statut</h3>
          <StatusBadge
            className=""
            status={currentStatus}
            reason={reason}
            size="md"
          />
        </div>

        <div className="border-t border-border border-b py-4">
          <Timeline items={statusHistory.slice(0, 3)} compact />

          {statusHistory.length > 3 && (
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
          )}
        </div>

        {canViewActions && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {canAccept && (
                <AcceptConferenceDialog
                  id={conferenceId}
                  disabled={!canAccept}
                />
              )}

              {canValidate && (
                <ValidateConferenceDialog
                  id={conferenceId}
                  disabled={!canValidate}
                />
              )}

              {canConfirm && (
                <AcceptConferenceDialog
                  id={conferenceId}
                  confirm={true}
                  disabled={!canConfirm}
                />
              )}

              {canReject && (
                <RejectConferenceDialog
                  id={conferenceId}
                  permanentRejection={false}
                  disabled={!canReject}
                />
              )}

              {canRejectPermanently && (
                <RejectConferenceDialog
                  id={conferenceId}
                  permanentRejection={true}
                  disabled={!canRejectPermanently}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusActionPanel;
