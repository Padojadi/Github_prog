import "./css/globals.css";
import "./css/style.css";

import { Source_Sans_3, Londrina_Solid, Rubik } from "next/font/google";
import Theme from "./theme-provider";
import AppProvider from "./app-provider";
import { PrintProvider } from "./print-context";
import QueryProvider from "@/providers/query-provider";
import Providers from "@/providers/providers";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

const LondrinaSolid = Londrina_Solid({
  subsets: ["latin"],
  variable: "--font-londrina-solid",
  weight: ["400", "300"],
  display: "swap",
  adjustFontFallback: false,
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata = {
  title: "Protosen - REPUBLIQUE DU SENEGAL",
  description: "Protosen - REPUBLIQUE DU SENEGAL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
      <body
        className={`${sourceSans.variable} ${LondrinaSolid.variable} ${rubik.variable} font-source-sans antialiased bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400`}
      >
        <Theme>
          <QueryProvider>
            <AppProvider>
              <PrintProvider>
                <Providers>{children}</Providers>
              </PrintProvider>
            </AppProvider>
          </QueryProvider>
        </Theme>
      </body>
    </html>
  );
}
