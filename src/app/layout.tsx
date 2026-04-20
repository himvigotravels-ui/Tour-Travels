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

export const metadata: Metadata = {
  title: {
    template: "%s | Himvigo Tours",
    default: "Himvigo Tours | Premium Travel & Spiti Valley Packages",
  },
  description: "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.",
  keywords: ["Himachal Pradesh Tours", "Spiti Valley Packages", "Manali Tour", "Kasol Trek", "Chandigarh to Manali Cabs", "Premium Travel Himachal"],
  authors: [{ name: "Himvigo Tours" }],
  creator: "Himvigo Tours",
  publisher: "Himvigo Tours",
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
    title: "Himvigo Tours | Premium Travel & Spiti Valley Packages",
    description: "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.",
    siteName: "Himvigo Tours",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Himvigo Tours - Premium Himalayan Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himvigo Tours | Premium Travel & Spiti Valley Packages",
    description: "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours, trekking expeditions, and reliable Chandigarh to Manali cab services.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "scroll-smooth", inter.variable, outfit.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-inter">
        <Navbar />
        {children}
        <Footer />
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
