"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-red-400 p-4 text-white">
      <h2>Quelque chose s'est mal passé !</h2>
      <button
        className="btn bg-red-500 hover:bg-red-600 text-white"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Réessayer
      </button>
    </div>
  );
}
