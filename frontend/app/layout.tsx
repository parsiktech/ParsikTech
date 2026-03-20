import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, JetBrains_Mono, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Parsik Tech Group – Software, Systems, Execution",
  description: "Production-grade software, infrastructure, and growth — built to perform.",
  metadataBase: new URL("https://parsiktechgroup.com"),
  openGraph: {
    title: "Parsik Tech Group – Software, Systems, Execution",
    description: "Production-grade software, infrastructure, and growth — built to perform.",
    url: "https://parsiktechgroup.com",
    siteName: "Parsik Tech Group",
    images: [
      {
        url: "/PTG LOGOS/WhiteTPTGblackBG.png",
        width: 1200,
        height: 630,
        alt: "Parsik Tech Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parsik Tech Group – Software, Systems, Execution",
    description: "Production-grade software, infrastructure, and growth — built to perform.",
    images: ["/PTG LOGOS/WhiteTPTGblackBG.png"],
  },
  icons: {
    icon: "/EvilEyeLogo.png",
    apple: "/EvilEyeLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${plusJakarta.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LDX1BJYQ47');
          `}
        </Script>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}
