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
import { AccommodationForm } from "./accommodation-form";

export function AccommodationCreationModal({
  conferenceId,
}: {
  conferenceId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4 mr-2" />
          Ajouter un nouvel hébergement
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            Ajouter un nouvel hébergement
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <AccommodationForm onClose={() => setOpen(false)} />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
