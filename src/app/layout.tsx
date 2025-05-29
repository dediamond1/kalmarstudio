"use client";
import "./globals.css";
import "../values/css-variables.scss";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {!isDashboard && <Header />}
          {children}
        </Providers>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              border: "none",
              borderRadius: "8px",
            },
            classNames: {
              toast: "!p-4",
              error: "!bg-red-600 !text-white",
              success: "!bg-green-600 !text-white",
            },
          }}
        />
      </body>
    </html>
  );
}
