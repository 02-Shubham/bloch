import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloch sphere simulator",
  description: "This is a bloch sphere simulator for an uni project",
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
