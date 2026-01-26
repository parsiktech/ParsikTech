import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parsik Tech Group – Software, Systems, Execution",
  description: "We build custom software, websites, and marketing systems that automate growth, improve conversions, and scale with your business.",
  metadataBase: new URL("https://parsiktechgroup.com"),
  openGraph: {
    title: "Parsik Tech Group – Software, Systems, Execution",
    description: "We build custom software, websites, and marketing systems that automate growth, improve conversions, and scale with your business.",
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
    description: "We build custom software, websites, and marketing systems that automate growth, improve conversions, and scale with your business.",
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
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LDX1BJYQ47');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
