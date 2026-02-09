import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redhorse Performance",
  description: "Build a custom Redhorse hose assembly in nine guided steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
