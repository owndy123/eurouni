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

export type CityBucket = 'small' | 'med' | 'large'

export interface CityInfo {
  name: string
  country: string
  lat: number
  lng: number
  population: number
  bucket: CityBucket
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

// City population buckets: small (<100k), med (100k-1M), large (>1M)
export const CITY_POPULATION_BUCKETS: Record<string, { population: number; bucket: CityBucket }> = {
  // Slovakia
  'bratislava': { population: 500000, bucket: 'large' },
  'kosice': { population: 240000, bucket: 'med' },
  'nitra': { population: 80000, bucket: 'small' },
  'zilina': { population: 81000, bucket: 'small' },
  'banska-bystrica': { population: 78000, bucket: 'small' },
  'presov': { population: 88000, bucket: 'small' },
  'trnava': { population: 66000, bucket: 'small' },
  // Czech Republic
  'prague': { population: 1300000, bucket: 'large' },
  'brno': { population: 380000, bucket: 'med' },
  'ostrava': { population: 280000, bucket: 'med' },
  'plzen': { population: 170000, bucket: 'med' },
  'olomouc': { population: 100000, bucket: 'med' },
  // Austria
  'vienna': { population: 1900000, bucket: 'large' },
  'graz': { population: 280000, bucket: 'med' },
  'linz': { population: 200000, bucket: 'med' },
  'innsbruck': { population: 130000, bucket: 'med' },
  // Poland
  'warsaw': { population: 1800000, bucket: 'large' },
  'krakow': { population: 770000, bucket: 'large' },
  'wroclaw': { population: 640000, bucket: 'large' },
  'poznan': { population: 540000, bucket: 'large' },
  'gdansk': { population: 470000, bucket: 'med' },
  // Hungary
  'budapest': { population: 1700000, bucket: 'large' },
  'debrecen': { population: 200000, bucket: 'med' },
  'szeged': { population: 160000, bucket: 'med' },
  'pecs': { population: 140000, bucket: 'med' },
  // Germany
  'munich': { population: 1500000, bucket: 'large' },
  'berlin': { population: 3600000, bucket: 'large' },
  'hamburg': { population: 1900000, bucket: 'large' },
  'frankfurt': { population: 750000, bucket: 'large' },
  // Netherlands
  'amsterdam': { population: 870000, bucket: 'large' },
  'rotterdam': { population: 640000, bucket: 'large' },
  'utrecht': { population: 340000, bucket: 'med' },
}

// University QS rankings (approximate)
export const UNIVERSITY_RANKINGS: Record<string, number> = {
  // Germany
  'tum': 37,
  'lmu': 59,
  'tu-berlin': 148,
  'rwth': 99,
  'heidelberg': 84,
  'charite': 118,
  'kit': 119,
  'tu-munich': 37,
  'fau': 218,
  'tu-dresden': 194,
  'u-freiburg': 86,
  'u-munich': 59,
  // Austria
  'univie': 140,
  'tu-wien': 184,
  'u-graz': 321,
  'u-innsbruck': 298,
  'u-salzburg': 451,
  // Czech Republic
  'charles-university': 268,
  'ctu-prague': 410,
  'masaryk': 421,
  // Poland
  'uw': 322,
  'uj': 368,
  'tu-warsaw': 601,
  // Hungary
  'elte': 701,
  'budapest-uni': 801,
  // Slovakia
  'ukba': 1001,
  'tu-kosice': 1201,
  // Netherlands
  'tue': 138,
  'tu-delft': 47,
  'eur': 180,
  'uu': 132,
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

/**
 * Get city info including population bucket
 */
export function getCityInfo(cityName: string): CityInfo | null {
  const normalized = cityName.toLowerCase().trim()
  const coords = CITY_COORDINATES[normalized]
  const popData = CITY_POPULATION_BUCKETS[normalized]
  if (!coords || !popData) return null
  return {
    name: normalized,
    country: '', // country info not stored, would need separate mapping
    lat: coords.lat,
    lng: coords.lng,
    population: popData.population,
    bucket: popData.bucket,
  }
}

/**
 * Score city size match (0-100)
 * citySizePreference: 0 = village (<100k), 100 = metropolis (>1M)
 */
export function scoreCitySize(citySizePreference: number, cityBucket: CityBucket): number {
  // Define bucket thresholds as midpoints
  const bucketMidpoints: Record<CityBucket, number> = {
    small: 50,   // < 100k
    med: 550,    // 100k - 1M (midpoint)
    large: 950,  // > 1M
  }
  const target = bucketMidpoints[cityBucket]
  const diff = Math.abs(citySizePreference - target)
  // Max diff is ~950 (0 vs large), normalize to 0-100
  return Math.max(0, 100 - (diff / 950) * 100)
}

/**
 * Score tuition affordability (0-100)
 * budget: monthly budget in EUR
 * tuitionEur: annual tuition in EUR (0 = free)
 */
export function scoreTuition(budget: number, tuitionEur: number): number {
  if (tuitionEur === 0) return 100
  // Convert annual tuition to monthly equivalent for comparison
  const monthlyTuition = tuitionEur / 12
  if (monthlyTuition <= budget) return 75
  // Score decreases as tuition exceeds budget
  const ratio = budget / monthlyTuition
  return Math.max(0, ratio * 50)
}

// Field matching keywords for partial and related matches
const FIELD_KEYWORDS: Record<string, string[]> = {
  'computer-science': ['cs', 'computing', 'software', 'it', 'information', 'data'],
  'engineering': ['mechanical', 'electrical', 'civil', 'chemical', ' aerospace', 'automotive'],
  'business': ['management', 'economics', 'finance', 'marketing', 'accounting', 'mba'],
  'medicine': ['health', 'nursing', 'pharmacy', 'dentistry', 'biomedical'],
  'physics': ['astrophysics', 'quantum', 'materials'],
  'mathematics': ['stats', 'statistics', 'applied-math', 'financial-math'],
  'chemistry': ['biochemistry', 'molecular', 'pharmaceutical'],
  'biology': ['biotechnology', 'bioinformatics', 'ecology', 'genetics'],
  'psychology': ['counseling', 'social-work', 'cognitive'],
  'law': ['legal', 'jurisprudence', 'international-law'],
  'art': ['design', 'fine-arts', 'visual', 'music', 'theater'],
}

function normalizeField(field: string): string {
  return field.toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').trim()
}

/**
 * Score field of study match (0-100)
 * exact match = 100, partial = 60, related = 40, other = 10
 */
export function scoreFieldMatch(fieldOfStudy: string, programField: string): number {
  const normStudy = normalizeField(fieldOfStudy)
  const normProgram = normalizeField(programField)
  if (normStudy === normProgram) return 100
  // Check for exact match in keywords
  for (const [key, keywords] of Object.entries(FIELD_KEYWORDS)) {
    const studyInKey = normStudy.includes(key) || keywords.some(k => normStudy.includes(k))
    const programInKey = normProgram.includes(key) || keywords.some(k => normProgram.includes(k))
    if (studyInKey && programInKey) return 40 // related
  }
  // Check partial match (one contains the other)
  if (normStudy.includes(normProgram) || normProgram.includes(normStudy)) return 60
  return 10
}

/**
 * Score university ranking (0-100)
 * Top 50 = 100, Top 100 = 90, Top 200 = 75, Top 500 = 50, else = 30
 */
export function scoreRanking(ranking: number): number {
  if (ranking <= 50) return 100
  if (ranking <= 100) return 90
  if (ranking <= 200) return 75
  if (ranking <= 500) return 50
  return 30
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
  weights: WeightConfig = DEFAULT_WEIGHTS,
  universityParams?: {
    universityId?: string
    cityBucket?: CityBucket
    ranking?: number
    fieldOfStudy?: string
  }
): ProgramScore {
  // Academic score
  const academicScore = Math.min(100, (profile.gpa + profile.mathLevel + profile.scienceLevel) / 3)

  // Location score (based on city size preference)
  let locationScore = profile.preferredCitySize
  if (universityParams?.cityBucket) {
    locationScore = scoreCitySize(profile.preferredCitySize, universityParams.cityBucket)
  }

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

  // Budget score (use tuition scoring)
  const budgetScore = scoreTuition(profile.monthlyBudget, program.tuitionEur)

  // Career score (field matching)
  let careerScore = profile.careerFocus
  if (universityParams?.fieldOfStudy) {
    careerScore = scoreFieldMatch(universityParams.fieldOfStudy, program.field)
  }

  // Ranking score (new component)
  let rankingScore = 50 // default
  if (universityParams?.ranking) {
    rankingScore = scoreRanking(universityParams.ranking)
  }

  // Calculate weighted total (include ranking as part of academic/quality)
  const totalScore =
    academicScore * weights.academic +
    locationScore * weights.location +
    languageScore * weights.language +
    budgetScore * weights.budget +
    (careerScore * 0.6 + rankingScore * 0.4) * weights.career

  return {
    programId: '',
    universityId: universityParams?.universityId || '',
    score: Math.round(totalScore * 10) / 10,
    breakdown: {
      academic: Math.round(academicScore),
      location: Math.round(locationScore),
      language: Math.round(languageScore),
      budget: Math.round(budgetScore),
      career: Math.round(careerScore * 0.6 + rankingScore * 0.4),
    },
  }
}

/**
 * University data with coordinates, city bucket, and ranking
 */
interface UniversityWithCoords {
  id: string
  coordinates: Coordinates
  cityBucket?: CityBucket
  ranking?: number
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
  universities?: UniversityWithCoords[],
  studentFieldOfStudy?: string
): (ProgramScore & { distance?: number })[] {
  // If user has a home location, calculate distance scores
  const hasHomeLocation = profile.homeLocation && profile.distanceMax > 0

  const results: (ProgramScore & { distance?: number })[] = []

  for (const program of programs) {
    let distanceScore = 50
    let distance: number | undefined
    let filteredOut = false

    // Get university data
    const uni = universities?.find(u => u.id === program.universityId)

    if (hasHomeLocation && uni) {
      const dist = calculateDistance(profile.homeLocation!, uni.coordinates)

      // If beyond max distance, skip
      if (dist > profile.distanceMax) {
        filteredOut = true
      } else {
        distanceScore = Math.max(0, 100 - (dist / profile.distanceMax) * 100)
        distance = dist
      }
    }

    if (filteredOut) continue

    const result = calculateProgramScore(profile, program, weights, {
      universityId: program.universityId,
      cityBucket: uni?.cityBucket,
      ranking: uni?.ranking ?? UNIVERSITY_RANKINGS[program.universityId],
      fieldOfStudy: studentFieldOfStudy,
    })

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