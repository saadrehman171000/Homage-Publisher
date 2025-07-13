import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/contexts/app-context"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ClerkProvider, useUser } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Homage Educational Publishers - Quality Educational Books for All Grades",
  description:
    "Discover high-quality educational books for students from Pre-School to Grade 8. Curriculum-aligned content, affordable prices, and fast delivery across Pakistan.",
  keywords: "educational books, textbooks, Pakistan, students, learning materials, Homage Educational Publishers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user, isLoaded;
  try {
    // Only call useUser if inside ClerkProvider
    ({ user, isLoaded } = require("@clerk/nextjs").useUser());
    // eslint-disable-next-line no-console
    console.log("[RootLayout] isLoaded:", isLoaded, "user:", user, "email:", user?.primaryEmailAddress?.emailAddress);
  } catch (e) {
    // Ignore if useUser cannot be called here
  }
  return (
    <html lang="en">
      <head>
        {/* Primary favicon: red H SVG */}
        <link rel="icon" type="image/svg+xml" href="/favicon-h-red.svg" />
        {/* Theme-aware PNG favicons (optional, fallback) */}
        <link rel="icon" type="image/png" href="/images/homage-logo-02.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" href="/images/homage-logo-01.png" media="(prefers-color-scheme: dark)" />
        {/* Fallback favicon for legacy browsers */}
        <link rel="icon" href="/favicon.ico" />
        {/* Other icons remain for cross-platform support */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <AppProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AppProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
