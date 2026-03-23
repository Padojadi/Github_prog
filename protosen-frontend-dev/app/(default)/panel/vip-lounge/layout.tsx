import { Suspense } from "react";
import LoadingComponent from "@/components/loadingComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { hasPermission } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function VipLoungeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (
    !hasPermission(session?.user.accessGroup.permissions || [], [
      "ACCESS_VIP_LOUNGE_MODULE",
    ])
  ) {
    redirect("/panel/unauthorized");
  }

  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
}
