import { redirect } from "next/navigation";

export default function VisaFormDemandeRedirectPage() {
  redirect("/panel/visas/requests/new");
}
