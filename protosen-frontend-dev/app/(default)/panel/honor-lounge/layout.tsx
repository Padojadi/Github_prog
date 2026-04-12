import { authOptions } from "@/lib/auth/authOptions";
import { hasPermission } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HonorLoungeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (
    !hasPermission(session?.user?.accessGroup?.permissions || [], [
      "ACCESS_HONOR_LOUNGE_MODULE",
    ])
  ) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
