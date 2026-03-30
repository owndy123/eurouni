import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://eurouni.dev'),
  title: {
    default: 'EuroUni - Find Your Perfect University in Europe',
    template: '%s | EuroUni',
  },
  description: 'Discover European universities that match your profile. Use our Student Calculator to find programs that fit your academic goals, language skills, and budget.',
  keywords: ['European universities', 'university programs', 'student calculator', 'ECTS', 'international education', 'Bachelors programs', 'Masters programs'],
  authors: [{ name: 'EuroUni' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eurouni.dev',
    siteName: 'EuroUni',
    title: 'EuroUni - Find Your Perfect University in Europe',
    description: 'Discover European universities that match your profile. Use our Student Calculator to find programs that fit your academic goals, language skills, and budget.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EuroUni - European University Matching Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EuroUni - Find Your Perfect University in Europe',
    description: 'Discover European universities that match your profile. Use our Student Calculator to find programs that fit your academic goals, language skills, and budget.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}