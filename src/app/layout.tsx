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
    settings.seo_default_description ||
    "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.";
  const homeKeywords =
    settings.seo_home_keywords ||
    settings.seo_default_keywords ||
    "Himachal Pradesh Tours, Spiti Valley Packages, Manali Tour, Kasol Trek, Chandigarh to Manali Cabs, Premium Travel Himachal";

  const keywordsList =
    typeof homeKeywords === "string"
      ? homeKeywords.split(",").map((k) => k.trim())
      : ["Himvigo", "Himachal", "Tours"];

  // Resolve OG image: per-home override → site default → bundled fallback.
  const ogImage =
    settings.seo_home_og_image ||
    settings.seo_default_og_image ||
    "/opengraph-image.png";

  // Build dynamic icons. If admin uploaded custom URLs we expose those
  // explicitly via metadata.icons; otherwise we fall back silently to the
  // file-convention icons baked into the build (src/app/icon.svg, etc.).
  const iconList: { url: string; type?: string; sizes?: string }[] = [];
  if (settings.seo_favicon_svg) {
    iconList.push({ url: settings.seo_favicon_svg, type: "image/svg+xml" });
  }
  if (settings.seo_favicon_png) {
    iconList.push({
      url: settings.seo_favicon_png,
      type: "image/png",
      sizes: "any",
    });
  }
  const iconsBlock =
    iconList.length > 0 || settings.seo_apple_icon
      ? {
          icon: iconList.length > 0 ? iconList : undefined,
          apple: settings.seo_apple_icon || undefined,
        }
      : undefined;

  const twitterHandle = settings.seo_twitter_handle || "@himvigotours";
  const googleVerification =
    settings.seo_google_verification ||
    "8WFTUbPg8wJt_6TLKRHNAKGwRw2gHCgU0HSiqp--pAs";

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
    // Icons: admin-uploaded URLs override; otherwise Next.js auto-resolves
    // src/app/favicon.ico, src/app/icon.svg, src/app/apple-icon.png.
    icons: iconsBlock,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://www.himvigo.com",
      title: homeTitle,
      description: homeDesc,
      siteName: siteName,
      images: [
        {
          url: ogImage,
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
      images: [ogImage.startsWith("http") ? ogImage : `https://www.himvigo.com${ogImage}`],
      creator: twitterHandle,
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
      google: googleVerification,
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
          contact={{
            phone: settings.site_phone,
            whatsapp: settings.site_whatsapp,
            email: settings.site_email,
            address: settings.site_address,
          }}
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
