import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Programs - European University Programs',
  description: 'Explore over 50 European university programs. Filter by country, language, degree type, and distance. Find English-taught and tuition-free options.',
  openGraph: {
    title: 'Browse Programs | EuroUni',
    description: 'Explore over 50 European university programs. Filter by country, language, degree type, and distance.',
    url: 'https://eurouni.dev/programs',
  },
}

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
