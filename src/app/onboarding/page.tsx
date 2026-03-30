'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, Languages, Wallet, Target } from 'lucide-react'
import { calculateAllScores, DEFAULT_WEIGHTS, WeightConfig, getCoordinatesForCity } from '@/lib/calculator'
import { programs, universities, getUniversity, Program, University } from '@/data/mockData'
import ProgramCard from '@/components/program-card'
import CalculatorUI from '@/components/calculator-ui'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const steps = [
  { id: 1, title: 'Academic Profile', icon: GraduationCap },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Language & Budget', icon: Wallet },
  { id: 4, title: 'Career Goals', icon: Target },
  { id: 5, title: 'Results', icon: Check },
]

const formSchema = z.object({
  // Step 1: Academic
  gpa: z.number().min(0).max(100),
  mathLevel: z.number().min(0).max(100),
  scienceLevel: z.number().min(0).max(100),

  // Step 2: Location
  preferredCitySize: z.number().min(0).max(100),
  homeCountry: z.string().optional(),
  homeCity: z.string().optional(),
  distanceMax: z.number().min(50).max(1000),

  // Step 3: Language & Budget
  englishLevel: z.number().min(0).max(100),
  willingToLearnLocal: z.number().min(0).max(100),
  monthlyBudget: z.number().min(0).max(3000),

  // Step 4: Career
  careerFocus: z.number().min(0).max(100),
  fieldOfStudy: z.string(),
})

type FormData = z.infer<typeof formSchema>

const defaultValues: FormData = {
  gpa: 75,
  mathLevel: 70,
  scienceLevel: 65,
  preferredCitySize: 70,
  homeCountry: '',
  homeCity: 'bratislava',
  englishLevel: 80,
  willingToLearnLocal: 50,
  monthlyBudget: 1000,
  careerFocus: 60,
  fieldOfStudy: 'Computer Science',
  distanceMax: 500,
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS)
  const [results, setResults] = useState<Array<{ program: Program; university: University; score: number; distance?: number }>>([])

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = (data: FormData) => {
    const homeCoords = data.homeCity ? getCoordinatesForCity(data.homeCity) : null

    const profileWithLocation = {
      ...data,
      homeLocation: homeCoords || undefined,
    }

    const scores = calculateAllScores(profileWithLocation, programs, weights, universities)

    const resultsWithDetails = scores.slice(0, 10).map((score) => ({
      program: programs.find(p => p.id === score.programId)!,
      university: universities.find(u => u.id === score.universityId)!,
      score: score.score,
      distance: score.distance,
    })).filter(r => r.program && r.university)

    setResults(resultsWithDetails)
    setCurrentStep(5)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit(onSubmit)()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-bold text-slate-900">EuroUni</span>
          </div>
          <span className="text-sm text-slate-500">Step {currentStep} of 4</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200">
        <motion.div
          className="h-full bg-primary-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Navigation */}
      <nav className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.slice(0, 4).map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}
              >
                <div className={`flex items-center gap-2 ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-slate-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > step.id ? 'bg-primary-600 text-white' :
                    currentStep === step.id ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm hidden sm:block">{step.title}</span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <main className="max-w-2xl mx-auto px-4 pb-20">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Step 1: Academic Profile */}
          {currentStep === 1 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Academic Profile</CardTitle>
                <CardDescription>Tell us about your academic background.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Overall GPA (%)</Label>
                    <Controller
                      name="gpa"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0%</span>
                            <span className="font-medium text-primary-600">{field.value}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Math Proficiency (%)</Label>
                    <Controller
                      name="mathLevel"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0%</span>
                            <span className="font-medium text-primary-600">{field.value}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Science Proficiency (%)</Label>
                    <Controller
                      name="scienceLevel"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0%</span>
                            <span className="font-medium text-primary-600">{field.value}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Location Preferences</CardTitle>
                <CardDescription>Where would you like to study?</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Preferred City Size</Label>
                    <Controller
                      name="preferredCitySize"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Village</span>
                            <span className="font-medium text-primary-600">
                              {field.value < 33 ? 'Small Town' : field.value < 66 ? 'City' : 'Metropolis'}
                            </span>
                            <span>Metropolis</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Your Home City (for distance-based recommendations)</Label>
                    <Controller
                      name="homeCity"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bratislava">Bratislava (Slovakia)</SelectItem>
                            <SelectItem value="kosice">Košice (Slovakia)</SelectItem>
                            <SelectItem value="nitra">Nitra (Slovakia)</SelectItem>
                            <SelectItem value="zilina">Žilina (Slovakia)</SelectItem>
                            <SelectItem value="banska-bystrica">Banská Bystrica (Slovakia)</SelectItem>
                            <SelectItem value="presov">Prešov (Slovakia)</SelectItem>
                            <SelectItem value="trnava">Trnava (Slovakia)</SelectItem>
                            <SelectItem value="prague">Prague (Czech Republic)</SelectItem>
                            <SelectItem value="brno">Brno (Czech Republic)</SelectItem>
                            <SelectItem value="ostrava">Ostrava (Czech Republic)</SelectItem>
                            <SelectItem value="plzen">Plzeň (Czech Republic)</SelectItem>
                            <SelectItem value="olomouc">Olomouc (Czech Republic)</SelectItem>
                            <SelectItem value="vienna">Vienna (Austria)</SelectItem>
                            <SelectItem value="graz">Graz (Austria)</SelectItem>
                            <SelectItem value="linz">Linz (Austria)</SelectItem>
                            <SelectItem value="innsbruck">Innsbruck (Austria)</SelectItem>
                            <SelectItem value="warsaw">Warsaw (Poland)</SelectItem>
                            <SelectItem value="krakow">Kraków (Poland)</SelectItem>
                            <SelectItem value="wroclaw">Wrocław (Poland)</SelectItem>
                            <SelectItem value="poznan">Poznań (Poland)</SelectItem>
                            <SelectItem value="gdansk">Gdańsk (Poland)</SelectItem>
                            <SelectItem value="budapest">Budapest (Hungary)</SelectItem>
                            <SelectItem value="debrecen">Debrecen (Hungary)</SelectItem>
                            <SelectItem value="szeged">Szeged (Hungary)</SelectItem>
                            <SelectItem value="pecs">Pécs (Hungary)</SelectItem>
                            <SelectItem value="munich">Munich (Germany)</SelectItem>
                            <SelectItem value="berlin">Berlin (Germany)</SelectItem>
                            <SelectItem value="hamburg">Hamburg (Germany)</SelectItem>
                            <SelectItem value="frankfurt">Frankfurt (Germany)</SelectItem>
                            <SelectItem value="amsterdam">Amsterdam (Netherlands)</SelectItem>
                            <SelectItem value="rotterdam">Rotterdam (Netherlands)</SelectItem>
                            <SelectItem value="utrecht">Utrecht (Netherlands)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Maximum Distance: {watch('distanceMax')} km</Label>
                    <Controller
                      name="distanceMax"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={50}
                            max={1000}
                            step={50}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>50 km</span>
                            <span className="font-medium text-primary-600">
                              {field.value < 200 ? 'Nearby' : field.value < 500 ? 'Region' : 'Country +'}
                            </span>
                            <span>1000 km</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Language & Budget */}
          {currentStep === 3 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Language & Budget</CardTitle>
                <CardDescription>Your language skills and budget.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">English Level (%)</Label>
                    <Controller
                      name="englishLevel"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>None</span>
                            <span className="font-medium text-primary-600">
                              {field.value < 25 ? 'Beginner' : field.value < 50 ? 'Intermediate' : field.value < 75 ? 'Advanced' : 'Fluent'}
                            </span>
                            <span>Fluent</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Willing to Learn Local Language (%)</Label>
                    <Controller
                      name="willingToLearnLocal"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>No</span>
                            <span className="font-medium text-primary-600">{field.value}%</span>
                            <span>Yes</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Monthly Budget (EUR)</Label>
                    <Controller
                      name="monthlyBudget"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={3000}
                            step={100}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>€0</span>
                            <span className="font-medium text-primary-600">€{field.value}/month</span>
                            <span>€3000</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Career Goals */}
          {currentStep === 4 && (
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Career Goals</CardTitle>
                <CardDescription>What do you want to study?</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">How focused are you on a specific field? (%)</Label>
                    <Controller
                      name="careerFocus"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-1"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Flexible</span>
                            <span className="font-medium text-primary-600">{field.value}%</span>
                            <span>Specific</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Field of Study</Label>
                    <Controller
                      name="fieldOfStudy"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Medicine">Medicine</SelectItem>
                            <SelectItem value="Economics">Economics</SelectItem>
                            <SelectItem value="Law">Law</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Psychology">Psychology</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Weight Configuration */}
                <div className="pt-4 border-t border-border">
                  <CalculatorUI weights={weights} onWeightsChange={setWeights} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Top Matches</h2>
                <p className="text-slate-600">
                  Based on your profile, here are the programs that best fit you.
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((result, index) => (
                    <Card key={result.program.id} className="p-0 overflow-hidden">
                      <div className="flex">
                        {/* Rank badge */}
                        <div className={`w-12 flex flex-col items-center justify-center shrink-0 ${
                          index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600' : 'bg-muted'
                        }`}>
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate">{result.program.name}</h3>
                              <p className="text-sm text-muted-foreground">{result.university.name} · {result.university.country}</p>
                            </div>

                            {/* Score badge */}
                            <Badge variant={result.score >= 80 ? 'default' : result.score >= 60 ? 'secondary' : 'outline'} className="shrink-0 text-base px-3 py-1">
                              {Math.round(result.score)}%
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span>{result.program.ects} ECTS</span>
                            <span>·</span>
                            <span>{result.program.durationMonths} months</span>
                            <span>·</span>
                            <span className={result.program.tuitionEur === 0 ? 'text-green-600 font-medium' : ''}>
                              {result.program.tuitionEur === 0 ? 'Free' : `€${result.program.tuitionEur.toLocaleString()}/yr`}
                            </span>
                            <span>·</span>
                            <span className="capitalize">{result.program.language}</span>
                            {result.distance !== undefined && (
                              <>
                                <span>·</span>
                                <span>{Math.round(result.distance)} km away</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No matching programs found.</p>
                </Card>
              )}

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1)
                    setResults([])
                  }}
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
            <Button
              onClick={nextStep}
            >
              {currentStep === 4 ? 'Calculate Results' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
