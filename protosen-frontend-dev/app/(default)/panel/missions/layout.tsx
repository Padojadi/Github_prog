import { Suspense } from "react";
import LoadingComponent from "@/components/loadingComponent";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
}
