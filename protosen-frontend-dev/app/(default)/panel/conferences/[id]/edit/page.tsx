import { getConferenceById } from "@/features/conferences/lib/apis-client";
import EditConferenceSection from "@/features/conferences/components/conference-edition/conference-edit-section";

export default async function EditConferencePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const data = await getConferenceById(id);

  // let conferenceRes: TGetConferencesByIdResponse;
  // if ("code" in data) {
  //   if (data.code === "401") {
  //     redirect("/signin");
  //   }
  //   conferenceRes = {
  //     data: {} as Conference,
  //     message: data.message,
  //     status: "error",
  //   };
  // } else {
  //   conferenceRes = data;
  // }
  return <EditConferenceSection id={id} />;
}
