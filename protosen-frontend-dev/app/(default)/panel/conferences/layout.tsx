import { authOptions } from "@/lib/auth/authOptions";
import { hasPermission } from "@/lib/utils";
import { featureFlagStore } from "@/store/feature-flag-store";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function ConferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const conferencesEnabled = featureFlagStore.select((context) => context.conferences);
  const userPermissions = session?.user?.accessGroup?.permissions || [];
  const normalizedRole = String(session?.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const isAdmin = normalizedRole === "admin";
  const isSuperAdmin =
    normalizedRole === "super_admin" || normalizedRole === "superadmin";
  const hasConferenceAccess =
    hasPermission(userPermissions, ["ACCESS_CONFERENCE_MODULE"]) ||
    isAdmin ||
    isSuperAdmin;

  if (!conferencesEnabled.get().enabled && !hasConferenceAccess) {
    notFound();
  }

  if (!hasConferenceAccess) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
