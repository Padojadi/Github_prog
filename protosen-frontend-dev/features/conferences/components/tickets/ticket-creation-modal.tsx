import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TicketForm } from "./ticket-form";

export function TicketCreationModal({
  conferenceId,
  date,
}: {
  conferenceId: string;
  date: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4 mr-2" />
          Ajouter un nouveau ticket
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Ajouter un nouveau ticket</ResponsiveModalTitle>
        </ResponsiveModalHeader>

        {conferenceId && (
          <TicketForm
            conferenceId={conferenceId}
            date={date}
            onClose={() => setOpen(false)}
          />
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
