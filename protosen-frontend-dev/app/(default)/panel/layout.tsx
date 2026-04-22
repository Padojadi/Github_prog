import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Admin Dashboard",
//   description: "Protosen - REPUBLIQUE DU SENEGAL",
// };

export async function generateMetadata(): Promise<Metadata> {
  // get session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let role =
    user?.role === "super_admin"
      ? "Super Admin"
      : user?.role === "admin"
      ? "Admin"
      : "User";

  return {
    title: role + " Dashboard",
    description: "Protosen - REPUBLIQUE DU SENEGAL",
  };
}

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session && session.backendTokens && !session.backendTokens.accessToken)
  ) {
    redirect("/signin");
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header />

        <main className="grow [&>*:first-child]:scroll-mt-16 m-5">
          {children}
        </main>
      </div>
    </div>
  );
}
