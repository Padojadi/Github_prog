import { ConferenceRegistrationDetailsSection } from "@/features/conferences/components/registration-details/page-section";

export default function RegistrationsPage({
  params,
}: {
  params: { registrationId: string };
}) {
  const { registrationId } = params;
  return (
    <ConferenceRegistrationDetailsSection registrationId={registrationId} />
  );
}
