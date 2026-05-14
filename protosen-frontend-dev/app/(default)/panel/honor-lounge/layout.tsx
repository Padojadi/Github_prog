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
  const permissions = session?.user?.accessGroup?.permissions || [];
  const isAdmin = session?.user?.role === "admin";
  const isSuperAdmin = session?.user?.role === "super_admin";

  if (
    !hasPermission(permissions, [
      "ACCESS_HONOR_LOUNGE_MODULE",
      "ACCESS_CONFERENCE_MODULE",
    ]) &&
    !isAdmin &&
    !isSuperAdmin
  ) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
