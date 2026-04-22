import { ConferenceDetails } from "@/features/conferences/components/new-requests/conference-details";

export default async function ConferenceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // const data = await getConferenceById(id);

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

  return <ConferenceDetails id={id} />;
}
