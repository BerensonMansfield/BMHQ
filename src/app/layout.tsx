import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berenson & Mansfield HQ",
  description: "CRM and project management, in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
