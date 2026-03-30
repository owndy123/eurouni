import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'EuroUni - Find Your Perfect University in Europe',
  description: 'Discover European universities that match your profile. Use our Student Calculator to find programs that fit your academic goals, language skills, and budget.',
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