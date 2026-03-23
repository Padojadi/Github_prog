import LoadingComponent from "@/components/loadingComponent";
import { VerifyTicketCard } from "@/features/conferences/components/web/verify-ticket/verify-ticket-card";
import { Suspense } from "react";

export default function VerifyTicketPage() {
  return (
    <div className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 grid place-items-center min-h-screen">
      <div className="max-w-xl mx-auto w-full">
        <Suspense fallback={<LoadingComponent />}>
          <VerifyTicketCard />
        </Suspense>
      </div>
    </div>
  );
}
