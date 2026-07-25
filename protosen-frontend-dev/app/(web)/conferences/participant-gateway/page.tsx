import LoadingComponent from "@/components/loadingComponent";
import { WrapperLayerParticipantGateway } from "@/features/conferences/components/web/participant-gateway/wrapper-layer";
import { Suspense } from "react";

export default async function ParticipantGatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 flex flex-col items-center justify-center">
          <LoadingComponent />
        </div>
      }
    >
      <WrapperLayerParticipantGateway />
    </Suspense>
  );
}
