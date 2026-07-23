import type { Metadata, Viewport } from "next";
import { Syne, Manrope, Geist } from "next/font/google";
import { PortalLoader } from "@/components/portal-loader";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    icon: "/logo-main.png",
    apple: "/logo-main.png",
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
      className={cn("h-full", "antialiased", syne.variable, manrope.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <PortalLoader>{children}</PortalLoader>
      </body>
    </html>
  );
}
