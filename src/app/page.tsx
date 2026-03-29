'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Languages, Calculator, ArrowRight, Globe, Users } from 'lucide-react'
import { universities, programs, getStats, getUniversityWithLogo } from '@/data/mockData'

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

export default function Home() {
  const stats = getStats()
  const topUniversities = universities.slice(0, 6)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/programs" className="text-slate-600 hover:text-slate-900 transition-colors">
              Programs
            </Link>
            <Link
              href="/onboarding"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Matching
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6 text-balance">
              Find Your Perfect
              <span className="text-primary-600"> European University</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Discover programs across Europe that match your academic profile, language skills, and career goals. 
              Our Student Calculator helps you find the right fit.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-600/25 flex items-center gap-2"
              >
                Calculate Your Match
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/programs"
                className="text-slate-600 hover:text-slate-900 px-6 py-4 text-lg font-medium transition-colors"
              >
                Browse Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - MagicUI Style Bento */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center text-slate-900 mb-12"
          >
            How EuroUni Helps You
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100"
              >
                <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center text-slate-900 mb-4"
          >
            Universities Across Europe
          </motion.h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            {stats.totalPrograms} programs across {stats.totalUniversities} universities in {stats.countries} countries — Slovakia, Czech Republic, Austria, Poland, Hungary, Germany & Netherlands.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topUniversities.map((uni, index) => {
              const programCount = programs.filter(p => p.universityId === uni.id).length
              const uniWithLogo = getUniversityWithLogo(uni.id) || uni
              const logoUrl = uniWithLogo.logo
              return (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {logoUrl.startsWith('http') ? (
                      <img src={logoUrl} alt={uni.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Globe className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-xs line-clamp-2">{uni.name}</h3>
                  <p className="text-slate-500 text-xs">{uni.city}</p>
                  <p className="text-primary-600 text-xs">{programCount} programs</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Match?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Take our 2-minute assessment and discover programs that fit you perfectly.
            </p>
            <Link
              href="/onboarding"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
            >
              Start Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>© 2026 EuroUni. Helping European students find their path.</p>
        </div>
      </footer>
    </div>
  )
}