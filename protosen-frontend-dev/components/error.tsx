"use client"; // Error components must be Client Components

import { ErrorResponse } from "@/lib/errors";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";

export default function ErrorComponent({
  error,
  retry,
}: {
  error: Error | ErrorResponse | null;
  retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 text-foreground h-screen flex flex-col gap-4 justify-center items-center max-w-4xl mx-auto">
      <XCircle className="size-20" />
      <h2>Oops ! Une erreur s'est produite.</h2>
      <p className="text-center">
        Veuillez vérifier votre connexion ou essayer de recharger la page. Si le
        probleme persiste veuillez contacter le support
      </p>
      {/* <p>{error?.message}</p> */}
      <Button
        className=""
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => retry()
        }
      >
        Réessayer
      </Button>
    </div>
  );
}
