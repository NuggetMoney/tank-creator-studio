
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tank Creator Studio",
  description: "Create, customize, test, and share community-made tanks."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
