import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OthersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const isSuperAdmin = session?.user.role === "super_admin";

  if (!isSuperAdmin) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
