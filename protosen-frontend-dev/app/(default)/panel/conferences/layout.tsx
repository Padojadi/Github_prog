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
  const conferencesEnabled = featureFlagStore.select((context) => context.conferences)

  if (!conferencesEnabled.get().enabled) {
    notFound()
  }

  if (
    !hasPermission(session?.user?.accessGroup?.permissions || [], [
      "ACCESS_CONFERENCE_MODULE",
    ])
  ) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
