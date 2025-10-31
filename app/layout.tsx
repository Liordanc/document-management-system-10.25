import type React from "react"
import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Document Management System",
  description: "A web-based document management system with support for multiple file formats",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="h-screen flex flex-col max-w-[1440px] mx-auto">
            {/* Fixed Header */}
            <div className="flex-shrink-0 z-10">
              <Header />
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Fixed Sidebar */}
              <div className="flex-shrink-0">
                <Sidebar />
              </div>

              {/* Scrollable Main Content */}
              <div className="flex-1 min-w-0">
                <main className="h-full bg-background rounded-[32px] p-6 m-6 ml-0 overflow-y-auto">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </main>
              </div>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
