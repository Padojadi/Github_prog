import type { Metadata } from "next";
import WebNavbar from "@/components/layout/web-navbar";
import Footer from "@/components/layout/footer";
import { featureFlagStore } from "@/store/feature-flag-store";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Protosen",
  description: "Protosen - REPUBLIQUE DU SENEGAL",
};

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
	const conferencesEnabled = featureFlagStore.select((context) => context.conferences)

  if (!conferencesEnabled.get().enabled) {
    notFound()
  }
  return (
    <div className="">
      <WebNavbar />
      <main className="bg-gradient-background dark:bg-gradient-background-dark min-h-[100dvh]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
