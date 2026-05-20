import ConferenceRegistrationSection from "@/features/conferences/components/conference-registration/conference-registration-section";
import { getConferenceByIdPublic } from "@/features/conferences/lib/apis-client";
import { ConferencePublic } from "@/features/conferences/types";
import { TGetConferenceByIdPublicResponse } from "@/features/conferences/types/responses-types";

export default async function ConferenceRegistrationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const data = await getConferenceByIdPublic(id);

  let conferenceRes: TGetConferenceByIdPublicResponse;
  if ("code" in data) {
    conferenceRes = {
      data: {} as ConferencePublic,
      message: data.message,
      status: "error",
    };
  } else {
    conferenceRes = data;
  }
  return (
    <ConferenceRegistrationSection
      conferenceId={id}
      conference={conferenceRes.data}
    />
  );
}
