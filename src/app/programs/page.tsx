'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Search, SlidersHorizontal, X, Globe, BookOpen, Award, MapPin } from 'lucide-react'
import { programs, universities, getUniversity, getCountries } from '@/data/mockData'
import DistanceMap from '@/components/distance-map'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Language map
const languageMap: Record<string, string> = {
  english: 'English',
  local: 'Local',
  both: 'English & Local',
  german: 'German',
  polish: 'Polish',
}

// Degree options
const degreeOptions = [
  { value: 'bachelor', label: "Bachelor's" },
  { value: 'master', label: "Master's" },
]

// Language options
const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'local', label: 'Local Language' },
  { value: 'both', label: 'Both' },
]

export default function ProgramsPage() {
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedDegree, setSelectedDegree] = useState<string>('')
  const [maxDistance, setMaxDistance] = useState<number[]>([500])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const countries = useMemo(() => Array.from(new Set(universities.map(u => u.country))), [])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCountry) count++
    if (selectedLanguage) count++
    if (selectedDegree) count++
    if (maxDistance[0] < 1000) count++
    return count
  }, [selectedCountry, selectedLanguage, selectedDegree, maxDistance])

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

  // Stats
  const stats = useMemo(() => ({
    total: programs.length,
    englishTaught: programs.filter(p => p.language === 'english').length,
    freeTuition: programs.filter(p => p.tuitionEur === 0).length,
  }), [])

  const clearFilters = () => {
    setSelectedCountry('')
    setSelectedLanguage('')
    setSelectedDegree('')
    setMaxDistance([500])
  }

  // Filter Sidebar Component (for desktop and mobile sheet)
  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      {/* Country Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          Country
        </label>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            {countries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Language
        </label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            {languageOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Degree Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          Degree
        </label>
        <Select value={selectedDegree} onValueChange={setSelectedDegree}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Degrees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Degrees</SelectItem>
            {degreeOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Max Distance Slider */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Max Distance
          </span>
          <span className="text-primary font-medium">{maxDistance[0]}km</span>
        </label>
        <Slider
          value={maxDistance}
          onValueChange={setMaxDistance}
          min={50}
          max={1000}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>50km</span>
          <span>1000km</span>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full text-slate-600"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  // Program Card Component
  const ProgramCardComponent = ({ program, index }: { program: typeof programs[0], index: number }) => {
    const university = getUniversity(program.universityId)
    if (!university) return null

    const languageLabel = languageMap[program.language] || 'Mixed'
    const degreeLabel = program.degree === 'bachelor' ? "Bachelor's" : "Master's"

    return (
      <motion.div
        key={program.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Card className="group hover:border-primary/30 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {university.logo.startsWith('http') ? (
                  <img
                    src={university.logo}
                    alt={university.name}
                    className="w-10 h-10 object-contain rounded-lg bg-white border shrink-0"
                  />
                ) : (
                  <span className="text-2xl">{university.logo}</span>
                )}
                <div className="min-w-0">
                  <CardTitle className="text-base leading-tight line-clamp-1">
                    {program.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {university.name}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {degreeLabel}
              </Badge>
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                {languageLabel}
              </Badge>
              <Badge variant="ghost" className="text-xs">
                {program.field}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-medium text-slate-900">{program.ects}</div>
                <div className="text-slate-500">ECTS</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-medium text-slate-900">{program.durationMonths}mo</div>
                <div className="text-slate-500">Duration</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-medium text-slate-900">
                  {program.tuitionEur === 0 ? 'Free' : `€${program.tuitionEur}`}
                </div>
                <div className="text-slate-500">/year</div>
              </div>
            </div>

            {/* Expanded Info on Hover */}
            <div className="grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-y-1 group-hover:translate-y-0">
              <div className="bg-slate-50 rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Location</div>
                <div className="text-xs text-slate-700">
                  {university.city}, {university.country}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Workload</div>
                <div className="text-xs text-slate-700">
                  ~{Math.round(program.ects * 27.5)} hrs/yr
                </div>
              </div>
              <div className="col-span-2 bg-slate-50 rounded-lg p-2.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Entry Requirements</div>
                <div className="text-xs text-slate-700 line-clamp-2">
                  {program.entryRequirements.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={university.website} target="_blank">
                View Program
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/onboarding" className="text-slate-600 hover:text-slate-900">
              Start Matching
            </Link>
            <Link
              href="/onboarding"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Calculate Match
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Browse European University Programs
          </h1>
          <p className="text-slate-600 mb-6">
            {programs.length} programs across {universities.length} universities in {countries.length} countries
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs or universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <FilterSidebar />
                </div>
              </div>
            </aside>

            {/* Main Column */}
            <div className="space-y-6">
              {/* Mobile Filter Header */}
              <div className="lg:hidden flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">{filteredPrograms.length}</span> of {programs.length} programs
                </p>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1.5 bg-primary/10 text-primary">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Stats Summary - Desktop */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-slate-600">Total Programs</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.englishTaught}</div>
                    <div className="text-sm text-slate-600">English-Taught</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.freeTuition}</div>
                    <div className="text-sm text-slate-600">Tuition-Free</div>
                  </CardContent>
                </Card>
              </div>

              {/* Programs Grid */}
              <div className="lg:hidden">
                <AnimatePresence mode="wait">
                  {filteredPrograms.length > 0 ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      {filteredPrograms.slice(0, 20).map((program, index) => (
                        <ProgramCardComponent key={program.id} program={program} index={index} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-slate-500">No programs match your filters.</p>
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Clear filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden lg:block">
                {filteredPrograms.length > 0 ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {filteredPrograms.map((program, index) => (
                      <ProgramCardComponent key={program.id} program={program} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No programs match your filters.</p>
                    <Button variant="link" onClick={clearFilters} className="mt-2">
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sticky Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Map */}
                <DistanceMap maxDistance={maxDistance[0]} />

                {/* Sidebar CTA */}
                <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Find Your Perfect Match</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Take our assessment to get personalized program recommendations.
                  </p>
                  <Link
                    href="/onboarding"
                    className="block text-center bg-white text-primary py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                  >
                    Start Matching
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
