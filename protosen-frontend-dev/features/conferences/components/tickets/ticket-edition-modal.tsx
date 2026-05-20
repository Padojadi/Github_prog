import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { TicketForm } from "./ticket-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketsTypes } from "../../lib/data";
import { ConferencePass } from "../../types";

export function TicketEditionModal({
  conferenceId,
  initialData,
  date,
}: {
  conferenceId: string;
  initialData: ConferencePass;
  date: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Pen className="size-4 mr-2" />
          <span>Modifier le ticket</span>
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Modifier le ticket</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        {conferenceId && (
          <TicketForm
            conferenceId={conferenceId}
            initialData={initialData}
            date={date}
            onClose={() => setOpen(false)}
          />
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
