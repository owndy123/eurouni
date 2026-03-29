/**
 * Student Calculator - Weighted Scoring Algorithm
 * 
 * Formula: S = Σ(wi × ci)
 * where:
 * - wi = weight for criterion i (0-1, sum to 1)
 * - ci = user input value for criterion i (0-100)
 * - S = final compatibility score (0-100)
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface StudentProfile {
  // Academic (0-100)
  gpa: number
  mathLevel: number
  scienceLevel: number
  
  // Location (0-100)
  preferredCitySize: number // 0 = village, 100 = metropolis
  distanceMax: number // km, max distance from home
  homeLocation?: Coordinates // user's home coordinates
  
  // Language (0-100)
  englishLevel: number // 0 = none, 100 = fluent
  willingToLearnLocal: number // 0 = no, 100 = yes
  
  // Budget (0-100)
  monthlyBudget: number // EUR, will be normalized
  
  // Career (0-100)
  careerFocus: number // 0 = flexible, 100 = specific
}

// Common city coordinates for distance calculation
export const CITY_COORDINATES: Record<string, Coordinates> = {
  // Slovakia
  'bratislava': { lat: 48.1486, lng: 17.1077 },
  'kosice': { lat: 48.7164, lng: 21.2611 },
  'nitra': { lat: 48.3063, lng: 18.0865 },
  'zilina': { lat: 49.2238, lng: 18.7394 },
  'banska-bystrica': { lat: 48.7345, lng: 19.1525 },
  'presov': { lat: 48.9994, lng: 21.2391 },
  'trnava': { lat: 48.3774, lng: 17.5912 },
  // Czech Republic
  'prague': { lat: 50.0755, lng: 14.4378 },
  'brno': { lat: 49.1951, lng: 16.6068 },
  'ostrava': { lat: 49.8209, lng: 18.2625 },
  'plzen': { lat: 49.7384, lng: 13.3736 },
  'olomouc': { lat: 49.5939, lng: 17.2508 },
  // Austria
  'vienna': { lat: 48.2082, lng: 16.3738 },
  'graz': { lat: 47.0707, lng: 15.4395 },
  'linz': { lat: 48.3069, lng: 14.2858 },
  'innsbruck': { lat: 47.2692, lng: 11.4041 },
  // Poland
  'warsaw': { lat: 52.2297, lng: 21.0122 },
  'krakow': { lat: 50.0647, lng: 19.9450 },
  'wroclaw': { lat: 51.1079, lng: 17.0385 },
  'poznan': { lat: 52.4064, lng: 16.9252 },
  'gdansk': { lat: 54.3520, lng: 18.6466 },
  // Hungary
  'budapest': { lat: 47.4979, lng: 19.0402 },
  'debrecen': { lat: 47.5316, lng: 21.6273 },
  'szeged': { lat: 46.2500, lng: 20.1567 },
  'pecs': { lat: 46.0707, lng: 18.2331 },
  // Germany
  'munich': { lat: 48.1351, lng: 11.5820 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'hamburg': { lat: 53.5511, lng: 9.9937 },
  'frankfurt': { lat: 50.1109, lng: 8.6821 },
  // Netherlands
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'rotterdam': { lat: 51.9244, lng: 4.4777 },
  'utrecht': { lat: 52.0907, lng: 5.1214 },
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLng = toRad(coord2.lng - coord1.lng)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Get coordinates for a city name
 */
export function getCoordinatesForCity(cityName: string): Coordinates | null {
  const normalized = cityName.toLowerCase().trim()
  return CITY_COORDINATES[normalized] || null
}

export interface WeightConfig {
  academic: number
  location: number
  language: number
  budget: number
  career: number
}

export interface ProgramScore {
  programId: string
  universityId: string
  score: number
  distance?: number
  breakdown: {
    academic: number
    location: number
    language: number
    budget: number
    career: number
  }
}

// Default weights (can be adjusted)
export const DEFAULT_WEIGHTS: WeightConfig = {
  academic: 0.25,
  location: 0.15,
  language: 0.20,
  budget: 0.20,
  career: 0.20,
}

// Language preferences mapping
const LANGUAGE_LEVELS = {
  none: 0,
  basic: 25,
  intermediate: 50,
  fluent: 75,
  native: 100,
}

/**
 * Calculate compatibility score for a program
 */
export function calculateProgramScore(
  profile: StudentProfile,
  program: {
    language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak'
    tuitionEur: number
    durationMonths: number
    ects: number
    field: string
  },
  weights: WeightConfig = DEFAULT_WEIGHTS
): ProgramScore {
  // Academic score
  const academicScore = Math.min(100, (profile.gpa + profile.mathLevel + profile.scienceLevel) / 3)
  
  // Location score (based on city size preference - simplified)
  const locationScore = profile.preferredCitySize // Placeholder - would need city data
  
  // Language score
  let languageScore = 0
  if (program.language === 'english') {
    languageScore = profile.englishLevel
  } else if (program.language === 'local') {
    languageScore = profile.willingToLearnLocal
  } else {
    // Both - give credit for either
    languageScore = Math.max(profile.englishLevel, profile.willingToLearnLocal * 0.7)
  }
  
  // Budget score (normalize: 0 = can't afford, 100 = very comfortable)
  // Assume max reasonable budget is €2000/month
  const budgetScore = Math.min(100, (profile.monthlyBudget / 2000) * 100)
  
  // Career score (simplified - would need program field matching)
  const careerScore = profile.careerFocus // Placeholder - would need interest mapping
  
  // Calculate weighted total
  const totalScore = 
    academicScore * weights.academic +
    locationScore * weights.location +
    languageScore * weights.language +
    budgetScore * weights.budget +
    careerScore * weights.career
  
  return {
    programId: '',
    universityId: '',
    score: Math.round(totalScore * 10) / 10,
    breakdown: {
      academic: Math.round(academicScore),
      location: Math.round(locationScore),
      language: Math.round(languageScore),
      budget: Math.round(budgetScore),
      career: Math.round(careerScore),
    },
  }
}

/**
 * University data with coordinates
 */
interface UniversityWithCoords {
  id: string
  coordinates: Coordinates
}

/**
 * Calculate scores for multiple programs with distance filtering
 */
export function calculateAllScores(
  profile: StudentProfile,
  programs: Array<{
    id: string
    universityId: string
    language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak'
    tuitionEur: number
    durationMonths: number
    ects: number
    field: string
  }>,
  weights: WeightConfig = DEFAULT_WEIGHTS,
  universities?: UniversityWithCoords[]
): (ProgramScore & { distance?: number })[] {
  // If user has a home location, calculate distance scores
  const hasHomeLocation = profile.homeLocation && profile.distanceMax > 0
  
  const results: (ProgramScore & { distance?: number })[] = []
  
  for (const program of programs) {
    let distanceScore = 50
    let distance: number | undefined
    let filteredOut = false
    
    if (hasHomeLocation && universities) {
      const uni = universities.find(u => u.id === program.universityId)
      if (uni) {
        const dist = calculateDistance(profile.homeLocation!, uni.coordinates)
        
        // If beyond max distance, skip
        if (dist > profile.distanceMax) {
          filteredOut = true
        } else {
          distanceScore = Math.max(0, 100 - (dist / profile.distanceMax) * 100)
          distance = dist
        }
      }
    }
    
    if (filteredOut) continue
    
    const result = calculateProgramScore(profile, program, weights)
    
    // Adjust total score with distance component
    let totalScore = result.score
    if (hasHomeLocation) {
      totalScore = (result.score * 0.85) + (distanceScore * 0.15)
    }
    
    results.push({
      ...result,
      programId: program.id,
      universityId: program.universityId,
      score: Math.round(totalScore * 10) / 10,
      distance,
    })
  }
  
  return results.sort((a, b) => b.score - a.score)
}

/**
 * Get match level based on score
 */
export function getMatchLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent Match', color: 'text-green-600' }
  if (score >= 60) return { label: 'Good Match', color: 'text-blue-600' }
  if (score >= 40) return { label: 'Moderate Match', color: 'text-yellow-600' }
  return { label: 'Low Match', color: 'text-red-600' }
}

/**
 * Default student profile for demo
 */
export const DEFAULT_PROFILE: StudentProfile = {
  gpa: 75,
  mathLevel: 70,
  scienceLevel: 65,
  preferredCitySize: 70,
  distanceMax: 500,
  englishLevel: 80,
  willingToLearnLocal: 50,
  monthlyBudget: 1000,
  careerFocus: 60,
}