import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { getSettings } from "@/lib/db/settings";
import { getInternalPages } from "@/lib/db/pages";
import { getAllDestinations } from "@/lib/db/destinations";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { BookingPopup, BookingPopupConfig } from "@/components/ui/BookingPopup";

export const dynamic = "force-dynamic";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || "Himvigo Tours";
  const homeTitle =
    settings.seo_home_title ||
    `${siteName} | Premium Travel & Spiti Valley Packages`;
  const homeDesc =
    settings.seo_home_description ||
    "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.";
  const homeKeywords =
    settings.seo_home_keywords ||
    "Himachal Pradesh Tours, Spiti Valley Packages, Manali Tour, Kasol Trek, Chandigarh to Manali Cabs, Premium Travel Himachal";

  const keywordsList =
    typeof homeKeywords === "string"
      ? homeKeywords.split(",").map((k) => k.trim())
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
    metadataBase: new URL("https://www.himvigo.com"),
    alternates: {
      canonical: "/",
    },
    // Favicon resolution is delegated to Next's file conventions:
    //   src/app/favicon.ico     → standard browser tab icon
    //   src/app/icon.svg        → high-res SVG (Google/light + dark mode)
    //   src/app/apple-icon.ico  → iOS home-screen icon
    // The previous manual block referenced /favicon.png (484×269,
    // non-square) which made search engines fall back to a default
    // logo. Removing it lets Next generate the right <link> tags.
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://www.himvigo.com",
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
      images: ["https://www.himvigo.com/opengraph-image.png"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, internalPages, destinations] = await Promise.all([
    getSettings(),
    getInternalPages(),
    getAllDestinations(),
  ]);

  const navDestinations = destinations
    .filter((d) => d.slug && d.name)
    .map((d) => ({ name: d.name, slug: d.slug }));

  const popupConfig: BookingPopupConfig = {
    enabled: settings.booking_popup_enabled === "true",
    title:
      settings.booking_popup_title ||
      "Plan your Himalayan getaway in 24 hours.",
    subtitle:
      settings.booking_popup_subtitle ||
      "Tell us where you want to go and our local experts will craft a no-obligation quote for you.",
    ctaText: settings.booking_popup_cta_text || "Get a free quote",
    ctaHref: settings.booking_popup_cta_link || "/contact",
    image: settings.booking_popup_image || undefined,
    pages: settings.booking_popup_pages || "all",
    delaySeconds: Number(settings.booking_popup_delay_seconds || 6),
    showOnce: (settings.booking_popup_show_once ?? "true") === "true",
    exitIntent: settings.booking_popup_exit_intent === "true",
    badge: settings.booking_popup_badge || "Limited slots",
  };

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        inter.variable,
        outfit.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-inter">
        <Navbar
          internalPages={internalPages}
          destinations={navDestinations}
        />
        {children}
        <Footer settings={settings} />
        <WhatsAppWidget phoneNumber={settings.site_whatsapp} />
        <BookingPopup config={popupConfig} />
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
            gtag('config', 'GT-T9B8VSPQ');
          `}
        </Script>
      </body>
    </html>
  );
}
