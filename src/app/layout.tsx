import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { i18n } from "@/lib/i18n";
import Providers from "./providers";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: i18n.app.name,
  description: i18n.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interSans.variable} font-sans antialiased`}>
        <Providers>
          <main className="mx-auto max-w-5xl px-4">
            <Header />
            {children}
            <Footer />
          </main>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
