import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or your Geist fonts
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Exchange",
  description: "The private network for elite AEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* The fix is right here vvv */}
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}