import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const link = searchParams.get("link");
  let message = "";
  if (!link) {
    message = "No link provided";
  } else {
    revalidatePath(link);
    message = `Revalidated ${link}`;
  }
  return new Response(message);
}
