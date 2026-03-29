'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, Languages, Wallet, Target } from 'lucide-react'
import { calculateAllScores, DEFAULT_WEIGHTS, WeightConfig, getCoordinatesForCity, CITY_COORDINATES } from '@/lib/calculator'
import { programs, universities, getUniversity, Program, University } from '@/data/mockData'
import ProgramCard from '@/components/program-card'
import CalculatorUI from '@/components/calculator-ui'

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
  distanceMax: z.number().min(0).max(2000),
  
  // Step 3: Language & Budget
  englishLevel: z.number().min(0).max(100),
  willingToLearnLocal: z.number().min(0).max(100),
  monthlyBudget: z.number().min(0).max(5000),
  
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
    // Get home coordinates from city
    const homeCoords = data.homeCity ? getCoordinatesForCity(data.homeCity) : null
    
    // Add home location to profile
    const profileWithLocation = {
      ...data,
      homeLocation: homeCoords || undefined,
    }
    
    // Calculate scores with distance filtering
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
          className="bg-white rounded-2xl border border-slate-200 p-8"
        >
          {/* Step 1: Academic Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Academic Profile</h2>
                <p className="text-slate-600">Tell us about your academic background.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Overall GPA (%)
                  </label>
                  <Controller
                    name="gpa"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>0%</span>
                          <span className="font-medium text-primary-600">{field.value}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Math Proficiency (%)
                  </label>
                  <Controller
                    name="mathLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>0%</span>
                          <span className="font-medium text-primary-600">{field.value}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Science Proficiency (%)
                  </label>
                  <Controller
                    name="scienceLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>0%</span>
                          <span className="font-medium text-primary-600">{field.value}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Location Preferences</h2>
                <p className="text-slate-600">Where would you like to study?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred City Size
                  </label>
                  <Controller
                    name="preferredCitySize"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Home City (for distance-based recommendations)
                  </label>
                  <Controller
                    name="homeCity"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select your city</option>
                        <optgroup label="Slovakia">
                          <option value="bratislava">Bratislava</option>
                          <option value="kosice">Košice</option>
                          <option value="nitra">Nitra</option>
                          <option value="zilina">Žilina</option>
                          <option value="banska-bystrica">Banská Bystrica</option>
                          <option value="presov">Prešov</option>
                          <option value="trnava">Trnava</option>
                        </optgroup>
                        <optgroup label="Czech Republic">
                          <option value="prague">Prague</option>
                          <option value="brno">Brno</option>
                          <option value="ostrava">Ostrava</option>
                          <option value="plzen">Plzeň</option>
                          <option value="olomouc">Olomouc</option>
                        </optgroup>
                        <optgroup label="Austria">
                          <option value="vienna">Vienna</option>
                          <option value="graz">Graz</option>
                          <option value="linz">Linz</option>
                          <option value="innsbruck">Innsbruck</option>
                        </optgroup>
                        <optgroup label="Poland">
                          <option value="warsaw">Warsaw</option>
                          <option value="krakow">Kraków</option>
                          <option value="wroclaw">Wrocław</option>
                          <option value="poznan">Poznań</option>
                          <option value="gdansk">Gdańsk</option>
                        </optgroup>
                        <optgroup label="Hungary">
                          <option value="budapest">Budapest</option>
                          <option value="debrecen">Debrecen</option>
                          <option value="szeged">Szeged</option>
                          <option value="pecs">Pécs</option>
                        </optgroup>
                        <optgroup label="Germany">
                          <option value="munich">Munich</option>
                          <option value="berlin">Berlin</option>
                          <option value="hamburg">Hamburg</option>
                          <option value="frankfurt">Frankfurt</option>
                        </optgroup>
                        <optgroup label="Netherlands">
                          <option value="amsterdam">Amsterdam</option>
                          <option value="rotterdam">Rotterdam</option>
                          <option value="utrecht">Utrecht</option>
                        </optgroup>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Distance: {watch('distanceMax')} km
                  </label>
                  <Controller
                    name="distanceMax"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          step="50"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
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
            </div>
          )}

          {/* Step 3: Language & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Language & Budget</h2>
                <p className="text-slate-600">Your language skills and budget.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    English Level (%)
                  </label>
                  <Controller
                    name="englishLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Willing to Learn Local Language (%)
                  </label>
                  <Controller
                    name="willingToLearnLocal"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>No</span>
                          <span className="font-medium text-primary-600">{field.value}%</span>
                          <span>Yes</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Budget (EUR)
                  </label>
                  <Controller
                    name="monthlyBudget"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="3000"
                          step="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>€0</span>
                          <span className="font-medium text-primary-600">€{field.value}/month</span>
                          <span>€3000</span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Career Goals */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Career Goals</h2>
                <p className="text-slate-600">What do you want to study?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    How focused are you on a specific field? (%)
                  </label>
                  <Controller
                    name="careerFocus"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>Flexible</span>
                          <span className="font-medium text-primary-600">{field.value}%</span>
                          <span>Specific</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Field of Study
                  </label>
                  <Controller
                    name="fieldOfStudy"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Economics">Economics</option>
                        <option value="Law">Law</option>
                        <option value="Physics">Physics</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  />
                </div>
              </div>

              {/* Weight Configuration */}
              <div className="pt-6 border-t border-slate-100">
                <CalculatorUI weights={weights} onWeightsChange={setWeights} />
              </div>
            </div>
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
                    <div key={result.program.id} className="relative">
                      {index === 0 && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                      )}
                      <ProgramCard
                        program={result.program}
                        university={result.university}
                        score={result.score}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500">No matching programs found.</p>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setCurrentStep(1)
                    setResults([])
                  }}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {currentStep === 4 ? 'Calculate Results' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}