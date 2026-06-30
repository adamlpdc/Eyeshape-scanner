import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { EYLURE_BRAND } from "@/constants/brand";
import { APP_COPY } from "@/constants/copy";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Discover your perfect lash match. Scan your eye shape on-device and get personalised Eylure lash recommendations.";

export const metadata: Metadata = {
  title: {
    default: APP_COPY.name,
    template: `%s | Eylure`,
  },
  description: siteDescription,
  applicationName: "Eylure",
  robots: { index: true, follow: true },
  openGraph: {
    title: APP_COPY.name,
    description: siteDescription,
    siteName: "Eylure",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_COPY.name,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: EYLURE_BRAND.resultsPink,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
