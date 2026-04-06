'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  Globe,
  BookOpen,
  GraduationCap,
  Euro,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
  MapPin,
  Languages,
  Clock,
  School,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { programs, universities, getUniversity } from '@/data/mockData'
import ProgramCard from '@/components/program-card'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const DistanceMap = dynamic(() => import('@/components/distance-map'), { ssr: false })

const ITEMS_PER_PAGE = 20

// Unique fields from programs
const ALL_FIELDS = Array.from(new Set(programs.map(p => p.field))).sort()

// Language display map
const LANGUAGE_MAP: Record<string, string> = {
  english: 'English',
  local: 'Local Language',
  both: 'English & Local',
  german: 'German',
  polish: 'Polish',
  hungarian: 'Hungarian',
  slovak: 'Slovak',
}

export default function ProgramsPage() {
  // Filter state
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedDegree, setSelectedDegree] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedField, setSelectedField] = useState<string>('')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('')
  const [maxTuition, setMaxTuition] = useState<number[]>([20000])
  const [freeOnly, setFreeOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Derived data
  const countries = useMemo(() => Array.from(new Set(universities.map(u => u.country))).sort(), [])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCountry) count++
    if (selectedDegree) count++
    if (selectedLanguage) count++
    if (selectedField) count++
    if (selectedUniversity) count++
    if (maxTuition[0] < 20000) count++
    if (freeOnly) count++
    return count
  }, [selectedCountry, selectedDegree, selectedLanguage, selectedField, selectedUniversity, maxTuition, freeOnly])

  // Filter + sort programs
  const filteredPrograms = useMemo(() => {
    let result = programs.filter(program => {
      const university = getUniversity(program.universityId)
      if (!university) return false

      // Text search
      if (search) {
        const q = search.toLowerCase()
        if (
          !program.name.toLowerCase().includes(q) &&
          !university.name.toLowerCase().includes(q) &&
          !program.field.toLowerCase().includes(q)
        ) {
          return false
        }
      }

      // Country
      if (selectedCountry && university.country !== selectedCountry) return false

      // Degree
      if (selectedDegree && program.degree !== selectedDegree) return false

      // Language
      if (selectedLanguage && program.language !== selectedLanguage) return false

      // Field
      if (selectedField && program.field !== selectedField) return false

      // University
      if (selectedUniversity && program.universityId !== selectedUniversity) return false

      // Tuition
      if (freeOnly && program.tuitionEur > 0) return false
      if (program.tuitionEur > maxTuition[0]) return false

      return true
    })

    // Sort
    const [field, dir] = sortBy.split('-') as [string, 'asc' | 'desc']
    result = [...result].sort((a, b) => {
      if (field === 'name') {
        const uniA = getUniversity(a.universityId)?.name ?? ''
        const uniB = getUniversity(b.universityId)?.name ?? ''
        const cmp = uniA.localeCompare(uniB)
        return dir === 'asc' ? cmp : -cmp
      }
      if (field === 'tuition') {
        return dir === 'asc' ? a.tuitionEur - b.tuitionEur : b.tuitionEur - a.tuitionEur
      }
      if (field === 'ects') {
        return dir === 'asc' ? a.ects - b.ects : b.ects - a.ects
      }
      return 0
    })

    return result
  }, [search, selectedCountry, selectedDegree, selectedLanguage, selectedField, selectedUniversity, maxTuition, freeOnly, sortBy])

  const visiblePrograms = filteredPrograms.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = visiblePrograms.length < filteredPrograms.length

  const clearFilters = () => {
    setSelectedCountry('')
    setSelectedDegree('')
    setSelectedLanguage('')
    setSelectedField('')
    setSelectedUniversity('')
    setMaxTuition([20000])
    setFreeOnly(false)
  }

  const handleFilterChange = () => setPage(1)

  // Filter Panel Component
  const FilterPanel = ({ className = '' }: { className?: string }) => (
    <div className={`space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
        </Badge>
      )}

      {/* Country */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          Country
        </label>
        <Select value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v); handleFilterChange(); }}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            {countries.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          Degree
        </label>
        <Select value={selectedDegree} onValueChange={(v) => { setSelectedDegree(v); handleFilterChange(); }}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Degrees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Degrees</SelectItem>
            <SelectItem value="bachelor">Bachelor&apos;s</SelectItem>
            <SelectItem value="master">Master&apos;s</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          Language
        </label>
        <Select value={selectedLanguage} onValueChange={(v) => { setSelectedLanguage(v); handleFilterChange(); }}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            {Object.entries(LANGUAGE_MAP).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Field of Study */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-slate-400" />
          Field of Study
        </label>
        <Select value={selectedField} onValueChange={(v) => { setSelectedField(v); handleFilterChange(); }}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Fields" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Fields</SelectItem>
            {ALL_FIELDS.map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* University */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          University
        </label>
        <Select value={selectedUniversity} onValueChange={(v) => { setSelectedUniversity(v); handleFilterChange(); }}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Universities</SelectItem>
            {universities.map(u => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Tuition Slider */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Euro className="w-3.5 h-3.5 text-slate-400" />
            Max Tuition
          </span>
          <span className="text-primary font-medium text-sm">
            {freeOnly ? 'Free only' : maxTuition[0] === 20000 ? 'Any' : `€${maxTuition[0].toLocaleString()}/yr`}
          </span>
        </label>
        <Slider
          value={maxTuition}
          onValueChange={(v) => { setMaxTuition(v); handleFilterChange(); }}
          min={0}
          max={20000}
          step={500}
          disabled={freeOnly}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>€0</span>
          <span>€20,000</span>
        </div>
      </div>

      {/* Free Only Toggle */}
      <button
        onClick={() => { setFreeOnly(!freeOnly); handleFilterChange(); }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
          freeOnly
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <span className="flex items-center gap-2">
          <Check className={`w-4 h-4 ${freeOnly ? 'opacity-100' : 'opacity-0'}`} />
          Tuition-Free Only
        </span>
        {freeOnly && <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Active</Badge>}
      </button>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full text-slate-500 border-slate-200"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </div>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/programs" className="text-primary font-medium">Programs</Link>
            <Link href="/universities" className="text-slate-600 hover:text-slate-900">Universities</Link>
            <Link href="/onboarding" className="text-slate-600 hover:text-slate-900">Match Me</Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Browse European University Programs
            </h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search programs, universities, or fields..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); handleFilterChange(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Badge variant="secondary" className="font-medium">{programs.length}</Badge>
              <span>programs</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Badge variant="secondary" className="font-medium bg-green-50 text-green-700 border-green-100">
                {programs.filter(p => p.tuitionEur === 0).length}
              </Badge>
              <span>tuition-free</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Badge variant="secondary" className="font-medium bg-blue-50 text-blue-700 border-blue-100">
                {programs.filter(p => p.language === 'english').length}
              </Badge>
              <span>English-taught</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <Card className="p-5">
                <FilterPanel />
              </Card>

              {/* Map Card */}
              <Card className="mt-4 p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  University Map
                </h4>
                <div className="rounded-lg overflow-hidden h-48">
                  <DistanceMap maxDistance={1000} />
                </div>
              </Card>

              {/* CTA */}
              <Card className="mt-4 overflow-hidden">
                <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-5 text-white">
                  <h4 className="font-semibold text-base mb-1">Find Your Perfect Match</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Take our 3-min assessment for personalized recommendations.
                  </p>
                  <Link
                    href="/onboarding"
                    className="block text-center bg-white text-primary font-medium py-2 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                  >
                    Start Matching
                  </Link>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0">
            {/* Top bar: results count + sort + mobile filter */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filteredPrograms.length}</span>
                {' '}program{filteredPrograms.length !== 1 ? 's' : ''}
                {search && <span className="text-slate-400"> for &quot;{search}&quot;</span>}
              </p>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 w-auto text-sm border-slate-200">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A–Z</SelectItem>
                    <SelectItem value="name-desc">Name Z–A</SelectItem>
                    <SelectItem value="tuition-asc">Lowest Tuition</SelectItem>
                    <SelectItem value="tuition-desc">Highest Tuition</SelectItem>
                    <SelectItem value="ects-asc">Fewest ECTS</SelectItem>
                    <SelectItem value="ects-desc">Most ECTS</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Sheet */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden h-9 border-slate-200 text-sm">
                      <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader className="pb-4">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <FilterPanel />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCountry && (
                  <FilterPill label={selectedCountry} onRemove={() => { setSelectedCountry(''); handleFilterChange(); }} />
                )}
                {selectedDegree && (
                  <FilterPill label={selectedDegree === 'bachelor' ? "Bachelor's" : "Master's"} onRemove={() => { setSelectedDegree(''); handleFilterChange(); }} />
                )}
                {selectedLanguage && (
                  <FilterPill label={LANGUAGE_MAP[selectedLanguage] || selectedLanguage} onRemove={() => { setSelectedLanguage(''); handleFilterChange(); }} />
                )}
                {selectedField && (
                  <FilterPill label={selectedField} onRemove={() => { setSelectedField(''); handleFilterChange(); }} />
                )}
                {selectedUniversity && (
                  <FilterPill label={getUniversity(selectedUniversity)?.name ?? selectedUniversity} onRemove={() => { setSelectedUniversity(''); handleFilterChange(); }} />
                )}
                {freeOnly && (
                  <FilterPill label="Tuition-Free" onRemove={() => { setFreeOnly(false); handleFilterChange(); }} />
                )}
                {maxTuition[0] < 20000 && !freeOnly && (
                  <FilterPill label={`Max €${maxTuition[0].toLocaleString()}/yr`} onRemove={() => setMaxTuition([20000])} />
                )}
              </div>
            )}

            {/* Programs Grid */}
            {filteredPrograms.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No programs found</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                  Try adjusting your filters or search terms to find more programs.
                </p>
                <Button variant="outline" onClick={() => { clearFilters(); setSearch(''); }}>
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {visiblePrograms.map((program, i) => {
                      const university = getUniversity(program.universityId)
                      if (!university) return null
                      return (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.025, 0.3) }}
                          layout
                        >
                          <ProgramCard program={program} university={university} />
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setPage(p => p + 1)}
                      className="px-8 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Load More Programs
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}

                {!hasMore && filteredPrograms.length > ITEMS_PER_PAGE && (
                  <p className="text-center text-sm text-slate-400 mt-6">
                    Showing all {filteredPrograms.length} programs
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// Small filter pill component
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}
