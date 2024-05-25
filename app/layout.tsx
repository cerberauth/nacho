import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nacho - OAuth / OpenID Connect Client Helper",
  description: "Nacho help you decide how to create an OAuth Client.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col bg-gray-100 dark:bg-gray-900 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
