import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Calculator - Find Your Perfect Program',
  description: 'Take our 2-minute assessment to discover European university programs that match your academic profile, language skills, and career goals.',
  openGraph: {
    title: 'Student Calculator | EuroUni',
    description: 'Take our 2-minute assessment to discover European university programs that match your academic profile, language skills, and career goals.',
    url: 'https://eurouni.dev/onboarding',
  },
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
