import LoadingComponent from "@/components/loadingComponent";
import { Suspense } from "react";
import ConferencesSectionWeb from "@/features/conferences/components/web/conferences-section";

export default function ConferencesPageWeb() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ConferencesSectionWeb />
    </Suspense>
  );
}
