'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, Languages, Wallet, Sparkles } from 'lucide-react'
import { calculateAllScores, DEFAULT_WEIGHTS, WeightConfig, getCoordinatesForCity, StudentProfile } from '@/lib/calculator'
import { programs, universities } from '@/data/mockData'
import { UniversityAvatar } from '@/components/university-avatar'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const STEPS = [
  { id: 1, title: 'Academic Profile', icon: GraduationCap },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Language', icon: Languages },
  { id: 4, title: 'Budget', icon: Wallet },
  { id: 5, title: 'Results', icon: Sparkles },
]

interface FormData {
  // Step 1: Academic
  gpa: number      // 1-5
  mathLevel: number // 0-100
  scienceLevel: number // 0-100

  // Step 2: Location
  homeCountry: string
  homeCity: string
  preferredCitySize: number // 0-100

  // Step 3: Language
  englishLevel: number // 0-100
  willingToLearnLocal: number // 0-100

  // Step 4: Budget
  monthlyBudget: number // 0-2000 EUR
  distanceMax: number   // 50-2000 km
}

const defaultValues: FormData = {
  gpa: 3,
  mathLevel: 70,
  scienceLevel: 65,
  homeCountry: 'Slovakia',
  homeCity: 'bratislava',
  preferredCitySize: 70,
  englishLevel: 80,
  willingToLearnLocal: 50,
  monthlyBudget: 1000,
  distanceMax: 500,
}

type ResultEntry = {
  program: typeof programs[number]
  university: typeof universities[number]
  score: number
  distance?: number
}

const COUNTRIES = ['Slovakia', 'Czech Republic', 'Austria', 'Poland', 'Hungary', 'Germany', 'Netherlands'] as const

const CITIES: Record<string, { value: string; label: string }[]> = {
  Slovakia: [
    { value: 'bratislava', label: 'Bratislava' },
    { value: 'kosice', label: 'Košice' },
    { value: 'nitra', label: 'Nitra' },
    { value: 'zilina', label: 'Žilina' },
    { value: 'banska-bystrica', label: 'Banská Bystrica' },
    { value: 'presov', label: 'Prešov' },
    { value: 'trnava', label: 'Trnava' },
  ],
  'Czech Republic': [
    { value: 'prague', label: 'Prague' },
    { value: 'brno', label: 'Brno' },
    { value: 'ostrava', label: 'Ostrava' },
    { value: 'plzen', label: 'Plzeň' },
    { value: 'olomouc', label: 'Olomouc' },
  ],
  Austria: [
    { value: 'vienna', label: 'Vienna' },
    { value: 'graz', label: 'Graz' },
    { value: 'linz', label: 'Linz' },
    { value: 'innsbruck', label: 'Innsbruck' },
  ],
  Poland: [
    { value: 'warsaw', label: 'Warsaw' },
    { value: 'krakow', label: 'Kraków' },
    { value: 'wroclaw', label: 'Wrocław' },
    { value: 'poznan', label: 'Poznań' },
    { value: 'gdansk', label: 'Gdańsk' },
  ],
  Hungary: [
    { value: 'budapest', label: 'Budapest' },
    { value: 'debrecen', label: 'Debrecen' },
    { value: 'szeged', label: 'Szeged' },
    { value: 'pecs', label: 'Pécs' },
  ],
  Germany: [
    { value: 'munich', label: 'Munich' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'frankfurt', label: 'Frankfurt' },
  ],
  Netherlands: [
    { value: 'amsterdam', label: 'Amsterdam' },
    { value: 'rotterdam', label: 'Rotterdam' },
    { value: 'utrecht', label: 'Utrecht' },
  ],
}

const FIELDS_OF_STUDY = [
  'Computer Science',
  'Engineering',
  'Business',
  'Medicine',
  'Economics',
  'Law',
  'Physics',
  'Psychology',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Environmental Science',
  'Art',
  'Other',
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(defaultValues)
  const [results, setResults] = useState<ResultEntry[]>([])
  const [fieldOfStudy] = useState('Computer Science')
  const [weights] = useState<WeightConfig>(DEFAULT_WEIGHTS)

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
    if (currentStep === 4) {
      calculateResults()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateResults = () => {
    const homeCoords = getCoordinatesForCity(formData.homeCity) ?? undefined

    // Build StudentProfile — GPA normalized from 1-5 to 0-100
    const profile: StudentProfile = {
      gpa: ((formData.gpa - 1) / 4) * 100, // 1-5 → 0-100
      mathLevel: formData.mathLevel,
      scienceLevel: formData.scienceLevel,
      preferredCitySize: formData.preferredCitySize,
      distanceMax: formData.distanceMax,
      homeLocation: homeCoords,
      englishLevel: formData.englishLevel,
      willingToLearnLocal: formData.willingToLearnLocal,
      monthlyBudget: formData.monthlyBudget,
      careerFocus: 50, // neutral default
    }

    const scored = calculateAllScores(
      profile,
      programs,
      weights,
      universities,
      fieldOfStudy
    )

    const top10 = scored.slice(0, 10).map(s => ({
      program: programs.find(p => p.id === s.programId)!,
      university: universities.find(u => u.id === s.universityId)!,
      score: s.score,
      distance: s.distance,
    })).filter(r => r.program && r.university)

    setResults(top10)
  }

  const progress = ((currentStep - 1) / 4) * 100

  const gpaLabel = (v: number) => {
    if (v <= 1) return 'Poor'
    if (v <= 2) return 'Below Average'
    if (v <= 3) return 'Average'
    if (v <= 4) return 'Good'
    return 'Excellent'
  }

  const citySizeLabel = (v: number) => {
    if (v < 33) return 'Small Town'
    if (v < 66) return 'City'
    return 'Metropolis'
  }

  const englishLabel = (v: number) => {
    if (v < 25) return 'Beginner'
    if (v < 50) return 'Intermediate'
    if (v < 75) return 'Advanced'
    return 'Fluent'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-bold text-slate-900">EuroUni</span>
          </Link>
          <span className="text-sm text-slate-500">
            {currentStep <= 4 ? `Step ${currentStep} of 4` : 'Your Results'}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep <= 4 && (
        <div className="h-1 bg-slate-200">
          <motion.div
            className="h-full bg-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Step Indicator */}
      <nav className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.slice(0, 4).map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex flex-col items-center gap-1 ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-slate-400'
                }`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep > step.id
                      ? 'bg-primary-600 text-white'
                      : currentStep === step.id
                      ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs hidden sm:block font-medium">{step.title}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-3 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Step Content */}
      <main className="max-w-2xl mx-auto px-4 pb-24">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 1: Academic Profile */}
          {currentStep === 1 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Academic Profile</CardTitle>
                <CardDescription>Tell us about your academic background.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">

                <div>
                  <Label className="mb-3 block">
                    GPA (1–5 scale)
                  </Label>
                  <div className="space-y-3">
                    <Slider
                      min={1}
                      max={5}
                      step={0.1}
                      value={[formData.gpa]}
                      onValueChange={([v]) => updateField('gpa', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1.0</span>
                      <span className="font-semibold text-primary-600 text-base">
                        {formData.gpa.toFixed(1)} — {gpaLabel(formData.gpa)}
                      </span>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Math Proficiency (%)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[formData.mathLevel]}
                      onValueChange={([v]) => updateField('mathLevel', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-primary-600">{formData.mathLevel}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Science Proficiency (%)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[formData.scienceLevel]}
                      onValueChange={([v]) => updateField('scienceLevel', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-primary-600">{formData.scienceLevel}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Location</CardTitle>
                <CardDescription>Where are you from and where would you like to study?</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Home Country</Label>
                    <Select value={formData.homeCountry} onValueChange={(v) => {
                      updateField('homeCountry', v)
                      updateField('homeCity', CITIES[v][0].value)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Home City</Label>
                    <Select value={formData.homeCity} onValueChange={(v) => updateField('homeCity', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(CITIES[formData.homeCountry] || []).map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Preferred City Size</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[formData.preferredCitySize]}
                      onValueChange={([v]) => updateField('preferredCitySize', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Village</span>
                      <span className="font-medium text-primary-600">
                        {citySizeLabel(formData.preferredCitySize)}
                      </span>
                      <span>Metropolis</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Step 3: Language */}
          {currentStep === 3 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Language</CardTitle>
                <CardDescription>Your language skills and adaptability.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">

                <div>
                  <Label className="mb-3 block">English Level (%)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[formData.englishLevel]}
                      onValueChange={([v]) => updateField('englishLevel', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>None</span>
                      <span className="font-medium text-primary-600">
                        {englishLabel(formData.englishLevel)} ({formData.englishLevel}%)
                      </span>
                      <span>Fluent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Willing to Learn Local Language (%)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[formData.willingToLearnLocal]}
                      onValueChange={([v]) => updateField('willingToLearnLocal', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Not interested</span>
                      <span className="font-medium text-primary-600">{formData.willingToLearnLocal}%</span>
                      <span>Fully willing</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Budget</CardTitle>
                <CardDescription>Your financial constraints for studying abroad.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">

                <div>
                  <Label className="mb-3 block">Monthly Budget (€)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={2000}
                      step={50}
                      value={[formData.monthlyBudget]}
                      onValueChange={([v]) => updateField('monthlyBudget', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>€0</span>
                      <span className="font-semibold text-primary-600 text-base">
                        €{formData.monthlyBudget}/month
                      </span>
                      <span>€2,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Maximum Distance from Home (km)</Label>
                  <div className="space-y-3">
                    <Slider
                      min={50}
                      max={2000}
                      step={50}
                      value={[formData.distanceMax]}
                      onValueChange={([v]) => updateField('distanceMax', v)}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>50 km</span>
                      <span className="font-semibold text-primary-600 text-base">
                        {formData.distanceMax < 200 ? 'Nearby' : formData.distanceMax < 500 ? 'Region' : formData.distanceMax < 1000 ? 'Country' : 'Any distance'}
                      </span>
                      <span>2,000 km</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Top Matches</h2>
                <p className="text-slate-600 text-sm">
                  Based on your profile, here are the programs that best fit you.
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((result, idx) => {
                    const rankColors = ['bg-yellow-400', 'bg-slate-300', 'bg-amber-600', 'bg-muted', 'bg-muted']
                    const scoreColor =
                      result.score >= 80 ? 'bg-green-500' :
                      result.score >= 60 ? 'bg-blue-500' :
                      result.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'

                    return (
                      <Card key={result.program.id} className="overflow-hidden p-0">
                        <div className="flex">
                          {/* Rank */}
                          <div className={`w-12 shrink-0 flex flex-col items-center justify-center ${rankColors[idx] ?? 'bg-muted'}`}>
                            <span className="text-sm font-bold text-white">{idx + 1}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <UniversityAvatar
                                  name={result.university.name}
                                  country={result.university.country}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-slate-900 truncate text-sm leading-tight">
                                    {result.program.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {result.university.name} · {result.university.country}
                                  </p>
                                </div>
                              </div>

                              {/* Score badge */}
                              <div className={`shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center ${scoreColor}`}>
                                <span className="text-white text-sm font-bold">{Math.round(result.score)}</span>
                                <span className="text-white text-[9px]">match</span>
                              </div>
                            </div>

                            {/* Details row */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>{result.program.ects} ECTS</span>
                              <span>·</span>
                              <span>{result.program.durationMonths} mo</span>
                              <span>·</span>
                              <span className={result.program.tuitionEur === 0 ? 'text-green-600 font-medium' : ''}>
                                {result.program.tuitionEur === 0 ? 'Free tuition' : `€${result.program.tuitionEur.toLocaleString()}/yr`}
                              </span>
                              <span>·</span>
                              <span className="capitalize">{result.program.language}</span>
                              {result.distance !== undefined && (
                                <>
                                  <span>·</span>
                                  <span>{Math.round(result.distance)} km</span>
                                </>
                              )}
                            </div>

                            {/* Entry requirements preview */}
                            {result.program.entryRequirements.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {result.program.entryRequirements.slice(0, 3).map((req, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No matching programs found. Try expanding your distance or budget.</p>
                </Card>
              )}

              <div className="flex flex-col items-center gap-3 pt-2">
                <Link href="/programs">
                  <Button variant="outline" className="gap-2">
                    View All Programs
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentStep(1)
                    setResults([])
                  }}
                  className="text-sm text-muted-foreground"
                >
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={nextStep}>
              {currentStep === 4 ? 'Calculate Results' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
