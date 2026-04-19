import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PortfolioChat } from "@/components/portfolio-chat";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPageData } from "@/lib/page-data";
import { getMetadataBase } from "@/lib/site-url";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Fresh DB-backed header/footer + metadata on every navigation (no ISR snapshot). */
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPageData();

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: `${site.name} — ${site.focus}`,
      template: `%s — ${site.name}`,
    },
    description:
      "Backend-focused engineer: distributed systems, high-scale services, Kafka pipelines, migrations, and performance work grounded in profiling and databases.",
    keywords: [
      "backend engineer",
      "distributed systems",
      "Go",
      "Kafka",
      "PostgreSQL",
      "site reliability",
      "Park+",
    ],
    authors: [{ name: site.name }],
    openGraph: {
      title: `${site.name} — ${site.focus}`,
      description:
        "Portfolio: systems design, production backend work, and engineering notes.",
      url: site.url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — Backend / Systems`,
      description:
        "Backend-focused engineer — scale, migrations, events, and performance.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPageData();
  const { site } = data;
  const focusHint =
    site.focus.split("·")[0]?.trim().toLowerCase() ?? "portfolio";

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-zinc-100 focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-950"
        >
          Skip to content
        </a>
        <SiteHeader
          siteName={site.name}
          focusHint={focusHint}
          showEducation={data.education.length > 0}
        />
        <main id="main-content">{children}</main>
        <SiteFooter site={site} />
        <PortfolioChat />
      </body>
    </html>
  );
}
