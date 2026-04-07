'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Languages, Calculator, ArrowRight, Globe, Users, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { universities, programs, getStats, getUniversityWithLogo } from '@/data/mockData'
import { UniversityAvatar } from '@/components/university-avatar'

// ============ FEATURES DATA ============
const features = [
  {
    icon: Calculator,
    title: 'Student Calculator',
    description: 'Our weighted algorithm matches you with programs based on your academic profile, preferences, and goals.',
  },
  {
    icon: MapPin,
    title: 'Distance Filtering',
    description: 'Find programs within your preferred distance from your home location using our interactive map.',
  },
  {
    icon: Languages,
    title: 'Language-Aware',
    description: 'We highlight whether programs are taught in English, local language, or both — crucial for international students.',
  },
  {
    icon: Users,
    title: 'ECTS Compatibility',
    description: 'Compare workload across borders using the European Credit Transfer System (1 ECTS = 25-30 hours).',
  },
]

// ============ UNIVERSITY CARD ============
function UniversityCard({
  university,
  programCount,
  index,
}: {
  university: { id: string; name: string; city: string; logo: string; country: string }
  programCount: number
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.15)' }}
    >
      <Card className="p-4 h-full transition-all duration-300 hover:border-primary/30 cursor-pointer">
        <CardHeader className="p-0 mb-3">
          <div className="flex items-center gap-3">
            <UniversityAvatar name={university.name} country={university.country} size="md" />
            <CardTitle className="line-clamp-2 text-sm leading-tight">
              {university.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-1">
          <p className="text-xs text-muted-foreground">{university.city}</p>
          <p className="text-xs font-medium text-primary">
            {programCount} program{programCount !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============ MAIN PAGE ============
export default function Home() {
  const stats = getStats()
  const topUniversities = universities.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* ============ NAVIGATION ============ */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              EuroUni
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/programs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Programs
            </Link>
            <Link
              href="/universities"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Universities
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button asChild size="sm">
              <Link href="/onboarding" className="gap-2">
                Start Matching
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="py-20 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge — plain, no sparkle icon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            {stats.totalPrograms} programs across Europe
          </div>

          {/* Headline — clean, no gradient text */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Find Your Perfect
            <span className="block text-primary">European University</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/onboarding">
                Find Your Program
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/programs">Browse All</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="py-12 px-4 border-b border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stats.totalPrograms}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Programs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stats.totalUniversities}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                Universities
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stats.countries}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                Countries
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stats.freeTuition}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Free Tuition
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES BENTO GRID ============ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How EuroUni Helps You
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful tools and data to help you make the best decision for your future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ UNIVERSITIES PREVIEW ============ */}
      <section className="py-20 px-4 bg-muted/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Universities Across Europe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From world-renowned technical universities to historic liberal arts colleges — find your perfect fit across {stats.countries} countries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUniversities.map((uni, index) => {
              const programCount = programs.filter(p => p.universityId === uni.id).length
              const uniWithLogo = getUniversityWithLogo(uni.id) || uni
              return (
                <UniversityCard
                  key={uni.id}
                  university={uniWithLogo}
                  programCount={programCount}
                  index={index}
                />
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/universities" className="gap-2">
                View All Universities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Take our 2-minute assessment and discover programs that match your academic profile, language skills, and career goals.
          </p>
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 gap-2"
            asChild
          >
            <Link href="/onboarding">
              Start Now — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 px-4 border-t border-border bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">EuroUni</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The platform helping European high school graduates find their perfect university program.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://github.com/owndy123/eurouni" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Programs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/programs?degree=bachelor" className="hover:text-foreground transition-colors">Bachelor&apos;s</Link></li>
                <li><Link href="/programs?degree=master" className="hover:text-foreground transition-colors">Master&apos;s</Link></li>
                <li><Link href="/programs?language=english" className="hover:text-foreground transition-colors">English-Taught</Link></li>
                <li><Link href="/programs?tuitionEur=0" className="hover:text-foreground transition-colors">Tuition-Free</Link></li>
              </ul>
            </div>

            {/* Countries */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Countries</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Germany', 'Netherlands', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary'].map(c => (
                  <li key={c}><Link href={`/programs?country=${c}`} className="hover:text-foreground transition-colors">{c}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/universities" className="hover:text-foreground transition-colors">Universities</Link></li>
                <li><Link href="/onboarding" className="hover:text-foreground transition-colors">Student Calculator</Link></li>
                <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EuroUni. Data sourced from public university records.
            </p>
            <p className="text-xs text-muted-foreground">
              Always verify admission requirements directly with the university before applying.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
