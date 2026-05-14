import ConferenceRegistationsSection from "@/features/conferences/components/registrations/page-section";

export default function RegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return <ConferenceRegistationsSection conferenceId={id} />;
}
