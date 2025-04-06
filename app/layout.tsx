import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import CursorEffect from '@/components/CursorEffect'

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Changed to allow zooming for accessibility
  userScalable: true, // Changed to allow users to zoom for accessibility
}

export const metadata: Metadata = {
  title: "Quranic Seminar - Numerical Inimitability in the Holy Quran",
  description:
    "A national seminar exploring the numerical patterns and mathematical miracles in the Holy Quran, organized by Akode Islamic Centre.",
  generator: 'Next.js',
  keywords: ["Quranic Seminar", "Numerical Inimitability", "Holy Quran", "Islamic Studies", "Mathematical Patterns", "Akode Islamic Centre", "Quran Research"],
  authors: [{ name: "Akode Islamic Centre", url: "https://www.aicedu.in/" }],
  creator: "Akode Islamic Centre",
  publisher: "Akode Islamic Centre",
  applicationName: "Quranic Seminar",
  metadataBase: new URL("https://quranicseminar.aicedu.in"),
  alternates: {
    canonical: "https://quranicseminar.aicedu.in",
  },
  openGraph: {
    title: "Quranic Seminar - Numerical Inimitability in the Holy Quran",
    description: "A national seminar exploring the numerical patterns in the Holy Quran, evidence of divine precision and authenticity.",
    url: "https://quranicseminar.aicedu.in",
    siteName: "Quranic Seminar",
    images: [
      {
        url: "https://quranicseminar.aicedu.in/images/quranic-seminar-image.jpg", // Create this image for better social sharing
        width: 1200,
        height: 630,
        alt: "Quranic Seminar Banner",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quranic Seminar - Numerical Inimitability in the Holy Quran",
    description: "A national seminar exploring the numerical patterns in the Holy Quran, evidence of divine precision and authenticity.",
    images: ["https://quranicseminar.aicedu.in/images/quranic-seminar-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to improve loading performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "National Seminar on Numerical Inimitability in the Holy Quran",
              "description": "A seminar exploring the mathematical patterns in the Holy Quran as evidence of divine precision.",
              "startDate": "2025-04-10T09:00:00+05:30",
              "endDate": "2025-04-10T17:00:00+05:30",
              "location": {
                "@type": "Place",
                "name": "Akode Islamic Centre",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Virippadam, Akode",
                  "addressLocality": "Vazhakkad, Malappuram",
                  "addressRegion": "Kerala",
                  "addressCountry": "India"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "Akode Islamic Centre",
                "url": "https://www.aicedu.in/"
              },
              "image": "https://quranicseminar.aicedu.in/images/quranic-seminar-image.jpg",
              "url": "https://quranicseminar.aicedu.in"
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <CursorEffect />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}