import type { Metadata } from "next"
import { Anton, Sora } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AnimateOnLoad from "@/components/AnimateOnLoad"
import CartDrawer from "@/components/cart/CartDrawer"
import ChatBubble from "@/components/chat/ChatBubble"
import ThemeProvider from "@/components/ThemeProvider"
import ToastContainer from "@/components/ui/Toast"

const heading = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
})

const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SHOOOS – Premium Sneakers",
  description: "Your destination for premium sneakers.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} font-body antialiased bg-surface text-ink`}
      >
        <svg className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-[0.015]"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="grainFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#grainFilter)" />
        </svg>
        <ThemeProvider>
          <SessionProvider>
            <Navbar />
            <AnimateOnLoad>
              <main className="min-h-screen">{children}</main>
            </AnimateOnLoad>
            <Footer />
            <CartDrawer />
            <ChatBubble />
            <ToastContainer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
