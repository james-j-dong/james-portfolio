import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { TerminalFrame } from "@/components/TerminalFrame";
import { TopBar } from "@/components/TopBar";
import { TabBar } from "@/components/TabBar";
import { StatusBar } from "@/components/StatusBar";
import { site } from "@/content/site";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} // PORTFOLIO`,
    template: `%s · ${site.name}`,
  },
  description: "Personal site of James Dong — software engineer.",
  metadataBase: new URL("https://jamesdong.dev"),
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body>
        <TerminalFrame>
          <TopBar />
          <TabBar />
          <main className="flex-1 p-4">{children}</main>
          <StatusBar />
        </TerminalFrame>
      </body>
    </html>
  );
}
