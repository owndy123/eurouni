'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { programs, universities, getUniversity, getCountries, getStats } from '@/data/mockData'
import ProgramCard from '@/components/program-card'
import DistanceMap from '@/components/distance-map'

export default function ProgramsPage() {
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedDegree, setSelectedDegree] = useState<string>('')
  const [maxDistance, setMaxDistance] = useState(500)
  const [showFilters, setShowFilters] = useState(false)

  const countries = Array.from(new Set(universities.map(u => u.country)))

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const university = getUniversity(program.universityId)
      if (!university) return false

      // Search
      if (search && !program.name.toLowerCase().includes(search.toLowerCase()) &&
          !university.name.toLowerCase().includes(search.toLowerCase())) {
        return false
      }

      // Country
      if (selectedCountry && university.country !== selectedCountry) {
        return false
      }

      // Language
      if (selectedLanguage && program.language !== selectedLanguage) {
        return false
      }

      // Degree
      if (selectedDegree && program.degree !== selectedDegree) {
        return false
      }

      return true
    })
  }, [search, selectedCountry, selectedLanguage, selectedDegree])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/onboarding" className="text-slate-600 hover:text-slate-900">
              Start Matching
            </Link>
            <Link
              href="/onboarding"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Calculate Match
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Browse European University Programs
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            {programs.length} programs across {universities.length} universities in {getCountries().length} countries
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs or universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Filters Toggle */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            <span className="text-sm text-slate-500">
              ({filteredPrograms.length} of {programs.length} programs)
            </span>
          </button>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 pb-8"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-xl border border-slate-200 p-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  <option value="">All Languages</option>
                  <option value="english">English</option>
                  <option value="local">Local Language</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Degree</label>
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  <option value="">All Degrees</option>
                  <option value="bachelor">Bachelor's</option>
                  <option value="master">Master's</option>
                </select>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Distance: {maxDistance}km
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCountry || selectedLanguage || selectedDegree || maxDistance < 1000) && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedCountry('')
                    setSelectedLanguage('')
                    setSelectedDegree('')
                    setMaxDistance(500)
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Programs Grid */}
            <div className="lg:col-span-2">
              {filteredPrograms.length > 0 ? (
                <div className="grid gap-4">
                  {filteredPrograms.map((program, index) => {
                    const university = getUniversity(program.universityId)
                    if (!university) return null
                    return (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProgramCard program={program} university={university} />
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">No programs match your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCountry('')
                      setSelectedLanguage('')
                      setSelectedDegree('')
                    }}
                    className="mt-4 text-primary-600 hover:text-primary-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar - Map */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <DistanceMap maxDistance={maxDistance} />
                
                {/* Stats */}
                <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Programs</span>
                      <span className="font-medium text-slate-900">{programs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">English-taught</span>
                      <span className="font-medium text-slate-900">
                        {programs.filter(p => p.language === 'english').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tuition-free</span>
                      <span className="font-medium text-slate-900">
                        {programs.filter(p => p.tuitionEur === 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average Duration</span>
                      <span className="font-medium text-slate-900">
                        {Math.round(programs.reduce((a, p) => a + p.durationMonths, 0) / programs.length)} months
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Find Your Perfect Match</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Take our assessment to get personalized program recommendations.
                  </p>
                  <Link
                    href="/onboarding"
                    className="block text-center bg-white text-primary-600 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                  >
                    Start Matching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}