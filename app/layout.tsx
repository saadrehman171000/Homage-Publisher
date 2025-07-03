import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/contexts/app-context"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}
