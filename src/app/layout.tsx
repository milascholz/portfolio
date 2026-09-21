import type { Metadata } from "next";
import localFont from "next/font/local";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const agrandir = localFont({
  src: "../fonts/AgrandirTight-HeavyItalic.ttf",
  variable: "--font-agrandir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mila Scholz",
  description: "Mechatronics + AI Engineering — portfolio of Mila Scholz.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${agrandir.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <div className="md:flex">
          <Sidebar />
          <main className="md:ml-[340px] md:flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
