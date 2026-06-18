import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import FloatingConcierge from "@/components/FloatingConcierge";

export const metadata: Metadata = {
    title: "Deepam Finance | Stock Market Academy & Financial Services",
    description:
      "Deepam Finance provides stock market education, options trading courses, investment guidance and financial literacy programs.",
  keywords: [
    "Deepan S B",
    "Deepam Financial Services",
    "Stock Market Mentor",
    "Financial Advisor",
    "Wealth Management",
    "Angel One Partner",
    "Mutual Funds",
    "Options Trading Course",
    "Financial Literacy",
  ],
  authors: [{ name: "Deepan S B" }],
  openGraph: {
    title: "Deepan S B | Stock Market Mentor & Financial Advisor",
    description: "Empowering Wealth Through Knowledge. Wealth Management Platform & Stock Market Academy.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FFFFFF" />
      </head>
      <body className="antialiased bg-white text-gray-900 selection:bg-primary/20 selection:text-primary">
        <Cursor />
        <FloatingConcierge />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
