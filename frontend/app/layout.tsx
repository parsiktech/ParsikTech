import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Parsik Tech Group",
  description: "Creating products and custom solutions for modern businesses",
  metadataBase: new URL("https://parsiktechgroup.com"),
  openGraph: {
    title: "The Parsik Tech Group",
    description: "Creating products and custom solutions for modern businesses",
    url: "https://parsiktechgroup.com",
    siteName: "Parsik Tech",
    images: [
      {
        url: "/PTG LOGOS/WhiteTPTGblackBG.png",
        width: 1200,
        height: 630,
        alt: "Parsik Tech",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Parsik Tech Group",
    description: "Creating products and custom solutions for modern businesses",
    images: ["/PTG LOGOS/WhiteTPTGblackBG.png"],
  },
  icons: {
    icon: "/PTG LOGOS/WhitePTnoBG.png",
    apple: "/PTG LOGOS/WhitePTnoBG.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
