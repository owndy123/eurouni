'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { GraduationCap, MapPin, Languages, Calculator, ArrowRight, Globe, Users, Sparkles, Target, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { universities, programs, getStats, getUniversityWithLogo } from '@/data/mockData'

// ============ ANIMATED COUNTER ============
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [displayValue, setDisplayValue] = useState(0)

  if (isInView && displayValue === 0) {
    animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })
  }

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// ============ SPOTLIGHT CARD ============
function SpotlightCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  index: number
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: '-50px' }}
      className="relative overflow-hidden rounded-2xl bg-card p-6 border border-border/50 shadow-sm"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(120,119,198,0.15), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

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
  university: { id: string; name: string; city: string; logo: string }
  programCount: number
  index: number
}) {
  const logoUrl = university.logo

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
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUrl.startsWith('http') ? (
                <img src={logoUrl} alt={university.name} className="w-8 h-8 object-contain" />
              ) : (
                <Globe className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
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
      <nav className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
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
      <section className="relative overflow-hidden py-24 px-4">
        {/* Aurora gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(120,119,198,0.4) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
              animation: 'aurora 8s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute top-20 left-1/4 w-[800px] h-[500px] opacity-20"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(59,130,246,0.5) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
              animation: 'aurora2 10s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute top-40 right-1/4 w-[600px] h-[400px] opacity-15"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(168,85,247,0.5) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
              animation: 'aurora3 12s ease-in-out infinite alternate',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              {stats.totalPrograms} programs across Europe
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                European University
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover {stats.totalPrograms} programs across {stats.totalUniversities} universities in {stats.countries} countries. 
              Our Student Calculator matches you based on your academic profile, language skills, and career goals.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25">
                <Link href="/onboarding">
                  Find Your Program
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/programs">Browse All</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="py-16 px-4 border-y border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stats.totalPrograms} />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Programs
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stats.totalUniversities} />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                Universities
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stats.countries} />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                Countries
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stats.freeTuition} />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Free Tuition
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES BENTO GRID ============ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How EuroUni Helps You
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful tools and data to help you make the best decision for your future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <SpotlightCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ UNIVERSITIES PREVIEW ============ */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Universities Across Europe
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            From world-renowned technical universities to historic liberal arts colleges — 
            find your perfect fit across {stats.countries} countries.
          </motion.p>

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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <Button asChild variant="outline" size="lg">
              <Link href="/programs" className="gap-2">
                View All Universities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-700" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-6">
            <Target className="w-4 h-4" />
            2-minute assessment
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Take our quick assessment and discover programs that perfectly match your academic profile, 
            language skills, and career aspirations.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 gap-2"
            asChild
          >
            <Link href="/onboarding">
              Start Now — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 px-4 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EuroUni</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EuroUni. Helping European students find their path.
          </p>
        </div>
      </footer>

      {/* Aurora keyframes */}
      <style>{`
        @keyframes aurora {
          0% { transform: translate(-50%, -10%) scale(1); opacity: 0.3; }
          100% { transform: translate(-50%, 10%) scale(1.1); opacity: 0.5; }
        }
        @keyframes aurora2 {
          0% { transform: translateX(-10%) translateY(-5%); opacity: 0.2; }
          100% { transform: translateX(10%) translateY(5%); opacity: 0.4; }
        }
        @keyframes aurora3 {
          0% { transform: translateX(5%) translateY(10%); opacity: 0.15; }
          100% { transform: translateX(-5%) translateY(-10%); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
