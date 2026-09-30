import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ProjectNavProvider } from "@/context/ProjectNavContext";

const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Switzer-SemiboldItalic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Switzer-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mila Scholz",
  description: "Portfolio of Mila Scholz — Created to create.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${switzer.variable} antialiased`}>
      <body className="min-h-screen flex flex-col md:flex-row gap-6 bg-background p-6 text-foreground">
        <ProjectNavProvider>
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </ProjectNavProvider>
      </body>
    </html>
  );
}
