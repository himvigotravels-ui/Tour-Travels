import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Script from "next/script";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { getSettings } from "@/lib/db/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || "Himvigo Tours";
  const homeTitle = settings.seo_home_title || `${siteName} | Premium Travel & Spiti Valley Packages`;
  const homeDesc = settings.seo_home_description || "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.";
  const homeKeywords = settings.seo_home_keywords || "Himachal Pradesh Tours, Spiti Valley Packages, Manali Tour, Kasol Trek, Chandigarh to Manali Cabs, Premium Travel Himachal";

  const keywordsList = typeof homeKeywords === 'string' 
    ? homeKeywords.split(",").map(k => k.trim()) 
    : ["Himvigo", "Himachal", "Tours"];

  return {
    title: {
      template: `%s | ${siteName}`,
      default: homeTitle,
    },
    description: homeDesc,
    keywords: keywordsList,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL("https://himvigo.com"),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/favicon.png" },
      ],
      other: [
        {
          rel: "apple-touch-icon-precomposed",
          url: "/favicon.png",
        },
      ],
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://himvigo.com",
      title: homeTitle,
      description: homeDesc,
      siteName: siteName,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${siteName} - Premium Himalayan Experiences`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: homeDesc,
      images: ["https://himvigo.com/opengraph-image.png"],
      creator: "@himvigotours",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "8WFTUbPg8wJt_6TLKRHNAKGwRw2gHCgU0HSiqp--pAs",
    },
  };
}

import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "scroll-smooth", inter.variable, outfit.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-inter">
        <Navbar />
        {children}
        <Footer settings={settings} />
        <WhatsAppWidget 
          phoneNumber={settings.site_whatsapp} 
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R18M7Q4X5Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R18M7Q4X5Q');
          `}
        </Script>
      </body>
    </html>
  );
}
