import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteOS — Construction Intelligence",
  description: "Construction site management and intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
