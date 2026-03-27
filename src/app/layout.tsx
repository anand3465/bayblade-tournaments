import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Beyblade X Arena",
  description: "Builds, tournaments, rankings, and battles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="floating-orb orb-blue top-20 left-10" />
          <div className="floating-orb orb-gold top-72 right-16" />
          <div className="floating-orb orb-red bottom-10 left-1/3" />

          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}