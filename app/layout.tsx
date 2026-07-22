import type { Metadata, Viewport } from "next";
import { Syne, Manrope } from "next/font/google";
import { PortalLoader } from "@/components/portal-loader";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vision Engine",
  description: "Building ideas into interactive experiences.",
  icons: {
    icon: "/blind.png",
    apple: "/blind.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c3b38",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <PortalLoader>{children}</PortalLoader>
      </body>
    </html>
  );
}
