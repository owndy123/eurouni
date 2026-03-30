/**
 * EuroUni Supabase Database Client
 * 
 * Provides typed data access functions that work with Supabase.
 * Falls back to mock data when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from './supabase'
import type { University, Program } from '@/data/mockData'
import type { StudentProfile, WeightConfig, ProgramScore } from './calculator'
import { 
  universities as mockUniversities, 
  programs as mockPrograms,
  getUniversity as mockGetUniversity,
  getProgramsForUniversity as mockGetProgramsForUniversity,
  getStats as mockGetStats,
} from '@/data/mockData'

// =============================================
// Types (aligned with mockData interfaces)
// =============================================

export interface UniversityWithCountry extends University {
  countryId?: string
  countryName?: string
}

export interface ProgramWithUniversity extends Program {
  university?: University
  countryName?: string
}

export interface ProgramFilters {
  country?: string
  field?: string
  degree?: 'bachelor' | 'master'
  language?: string
  maxTuition?: number
  freeOnly?: boolean
  countryId?: string
}

export interface ProgramScoreResult {
  program: ProgramWithUniversity
  score: number
  distance?: number
  breakdown: {
    academic: number
    location: number
    language: number
    budget: number
    career: number
  }
  matchLabel: string
}

export interface Stats {
  totalUniversities: number
  totalPrograms: number
  countries: number
  englishPrograms: number
  freeTuition: number
}

// =============================================
// Reference lookups (from Supabase or cache)
// =============================================

interface ReferenceData {
  countries: Map<string, string>  // code -> id
  studyFields: Map<string, string>  // slug -> id
  languages: Map<string, string>   // code -> id
  degreeTypes: Map<string, string>  // slug -> id
  instructionTypes: Map<string, string>  // slug -> id
}

let referenceDataCache: ReferenceData | null = null

async function loadReferenceData(): Promise<ReferenceData> {
  if (referenceDataCache) return referenceDataCache
  if (!supabase) throw new Error('Supabase not configured')

  const [countriesRes, fieldsRes, languagesRes, degreeTypesRes, instructionTypesRes] = await Promise.all([
    supabase.from('countries').select('id, code'),
    supabase.from('study_fields').select('id, slug'),
    supabase.from('languages').select('id, code'),
    supabase.from('degree_types').select('id, slug'),
    supabase.from('instruction_types').select('id, slug'),
  ])

  referenceDataCache = {
    countries: new Map(countriesRes.data?.map(c => [c.code, c.id]) || []),
    studyFields: new Map(fieldsRes.data?.map(f => [f.slug, f.id]) || []),
    languages: new Map(languagesRes.data?.map(l => [l.code, l.id]) || []),
    degreeTypes: new Map(degreeTypesRes.data?.map(d => [d.slug, d.id]) || []),
    instructionTypes: new Map(instructionTypesRes.data?.map(i => [i.slug, i.id]) || []),
  }

  return referenceDataCache
}

// =============================================
// University Functions
// =============================================

export async function getUniversities(): Promise<University[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockUniversities
  }

  try {
    const { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries!inner(name)
      `)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name')

    if (error) throw error

    return data.map(row => ({
      id: row.legacy_id || row.id,
      name: row.name,
      country: row.countries?.name || '',
      city: row.city,
      logo: row.logo_url || '🎓',
      website: row.website || '',
      coordinates: { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) },
      lastUpdated: new Date(row.updated_at).toISOString().split('T')[0],
    }))
  } catch (err) {
    console.error('[db] Error fetching universities:', err)
    return mockUniversities
  }
}

export async function getUniversity(id: string): Promise<University | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGetUniversity(id) || null
  }

  try {
    // Try legacy_id first, then UUID
    let { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries!inner(name)
      `)
      .or(`legacy_id.eq.${id},id.eq.${id}`)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      // Try as legacy_id from programs join
      const { data: pvData } = await supabase
        .from('program_versions')
        .select('*, programs:programs(university_id, universities(*, countries(name)))')
        .eq('is_current', true)
        .limit(1)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pv = pvData?.[0] as any
      if (pv?.programs?.universities) {
        data = pv.programs.universities
      }
    }

    if (!data) return null

    return {
      id: data.legacy_id || data.id,
      name: data.name,
      country: data.countries?.name || '',
      city: data.city,
      logo: data.logo_url || '🎓',
      website: data.website || '',
      coordinates: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
      lastUpdated: new Date(data.updated_at).toISOString().split('T')[0],
    }
  } catch (err) {
    console.error('[db] Error fetching university:', err)
    return mockGetUniversity(id) || null
  }
}

// =============================================
// Program Functions
// =============================================

export async function getPrograms(filters?: ProgramFilters): Promise<ProgramWithUniversity[]> {
  if (!isSupabaseConfigured || !supabase) {
    let programs = [...mockPrograms]
    if (filters?.country) {
      const countryUnis = mockUniversities.filter(u => u.country === filters.country).map(u => u.id)
      programs = programs.filter(p => countryUnis.includes(p.universityId))
    }
    if (filters?.field) {
      programs = programs.filter(p => p.field.toLowerCase().includes(filters.field!.toLowerCase()))
    }
    if (filters?.degree) {
      programs = programs.filter(p => p.degree === filters.degree)
    }
    if (filters?.language) {
      programs = programs.filter(p => p.language === filters.language)
    }
    if (filters?.freeOnly) {
      programs = programs.filter(p => p.tuitionEur === 0)
    }
    if (filters?.maxTuition) {
      programs = programs.filter(p => p.tuitionEur <= filters.maxTuition!)
    }
    
    return programs.map(p => ({
      ...p,
      university: mockUniversities.find(u => u.id === p.universityId),
    }))
  }

  try {
    let query = supabase
      .from('program_versions')
      .select(`
        *,
        programs!inner(
          *,
          universities!inner(*, countries!inner(name))
        )
      `)
      .eq('is_current', true)
      .eq('programs.is_active', true)
      .eq('programs.deleted_at', null)

    if (filters?.country) {
      query = query.eq('programs.universities.country_id', filters.country)
    }
    if (filters?.degree) {
      query = query.eq('programs.degree_type_id', filters.degree)
    }

    const { data, error } = await query

    if (error) throw error

    let programs = (data || []).map(row => ({
      id: row.programs.legacy_id || row.programs.id,
      universityId: row.programs.universities.legacy_id || row.programs.universities.id,
      name: row.programs.name,
      degree: row.programs.degree_types?.slug || 'bachelor',
      language: row.programs.instruction_types?.slug || 'english',
      ects: row.ects,
      durationMonths: row.duration_months,
      tuitionEur: row.tuition_eur,
      description: row.description || row.programs.description || '',
      entryRequirements: [], // TODO: join admission_criteria
      field: row.programs.study_fields?.slug || 'computer-science',
      lastUpdated: new Date(row.updated_at).toISOString().split('T')[0],
      university: {
        id: row.programs.universities.legacy_id || row.programs.universities.id,
        name: row.programs.universities.name,
        country: row.programs.universities.countries?.name || '',
        city: row.programs.universities.city,
        logo: row.programs.universities.logo_url || '🎓',
        website: row.programs.universities.website || '',
        coordinates: { 
          lat: parseFloat(row.programs.universities.latitude), 
          lng: parseFloat(row.programs.universities.longitude) 
        },
        lastUpdated: new Date(row.programs.universities.updated_at).toISOString().split('T')[0],
      },
    }))

    // Apply filters
    if (filters?.field) {
      programs = programs.filter(p => p.field.toLowerCase().includes(filters.field!.toLowerCase()))
    }
    if (filters?.language) {
      programs = programs.filter(p => p.language === filters.language)
    }
    if (filters?.freeOnly) {
      programs = programs.filter(p => p.tuitionEur === 0)
    }
    if (filters?.maxTuition) {
      programs = programs.filter(p => p.tuitionEur <= filters.maxTuition!)
    }

    return programs
  } catch (err) {
    console.error('[db] Error fetching programs:', err)
    return mockPrograms.map(p => ({
      ...p,
      university: mockUniversities.find(u => u.id === p.universityId),
    }))
  }
}

export async function getProgram(id: string): Promise<ProgramWithUniversity | null> {
  if (!isSupabaseConfigured || !supabase) {
    const program = mockPrograms.find(p => p.id === id)
    if (!program) return null
    return {
      ...program,
      university: mockUniversities.find(u => u.id === program.universityId),
    }
  }

  try {
    const { data, error } = await supabase
      .from('program_versions')
      .select(`
        *,
        programs!inner(
          *,
          universities!inner(*, countries!inner(name))
        )
      `)
      .eq('is_current', true)
      .or(`programs.legacy_id.eq.${id},programs.id.eq.${id}`)
      .single()

    if (error || !data) return null

    return {
      id: data.programs.legacy_id || data.programs.id,
      universityId: data.programs.universities.legacy_id || data.programs.universities.id,
      name: data.programs.name,
      degree: data.programs.degree_types?.slug || 'bachelor',
      language: data.programs.instruction_types?.slug || 'english',
      ects: data.ects,
      durationMonths: data.duration_months,
      tuitionEur: data.tuition_eur,
      description: data.description || data.programs.description || '',
      entryRequirements: [],
      field: data.programs.study_fields?.slug || 'computer-science',
      lastUpdated: new Date(data.updated_at).toISOString().split('T')[0],
      university: {
        id: data.programs.universities.legacy_id || data.programs.universities.id,
        name: data.programs.universities.name,
        country: data.programs.universities.countries?.name || '',
        city: data.programs.universities.city,
        logo: data.programs.universities.logo_url || '🎓',
        website: data.programs.universities.website || '',
        coordinates: { 
          lat: parseFloat(data.programs.universities.latitude), 
          lng: parseFloat(data.programs.universities.longitude) 
        },
        lastUpdated: new Date(data.programs.universities.updated_at).toISOString().split('T')[0],
      },
    }
  } catch (err) {
    console.error('[db] Error fetching program:', err)
    const program = mockPrograms.find(p => p.id === id)
    if (!program) return null
    return {
      ...program,
      university: mockUniversities.find(u => u.id === program.universityId),
    }
  }
}

export async function getProgramsForUniversity(universityId: string): Promise<Program[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGetProgramsForUniversity(universityId)
  }

  try {
    // First get the university's UUID
    const { data: uniData } = await supabase
      .from('universities')
      .select('id')
      .or(`legacy_id.eq.${universityId},id.eq.${universityId}`)
      .single()

    if (!uniData) return mockGetProgramsForUniversity(universityId)

    const { data, error } = await supabase
      .from('program_versions')
      .select(`
        *,
        programs!inner(
          *,
          study_fields!inner(slug),
          degree_types!inner(slug),
          instruction_types!inner(slug)
        )
      `)
      .eq('is_current', true)
      .eq('programs.university_id', uniData.id)

    if (error) throw error

    return (data || []).map(row => ({
      id: row.programs.legacy_id || row.programs.id,
      universityId: universityId,
      name: row.programs.name,
      degree: row.programs.degree_types?.slug || 'bachelor',
      language: row.programs.instruction_types?.slug || 'english',
      ects: row.ects,
      durationMonths: row.duration_months,
      tuitionEur: row.tuition_eur,
      description: row.description || row.programs.description || '',
      entryRequirements: [],
      field: row.programs.study_fields?.slug || 'computer-science',
      lastUpdated: new Date(row.updated_at).toISOString().split('T')[0],
    }))
  } catch (err) {
    console.error('[db] Error fetching programs for university:', err)
    return mockGetProgramsForUniversity(universityId)
  }
}

// =============================================
// Calculator / Scoring Functions
// =============================================

const DEFAULT_WEIGHTS: WeightConfig = {
  academic: 0.25,
  location: 0.15,
  language: 0.20,
  budget: 0.20,
  career: 0.20,
}

export async function calculateScores(
  profile: StudentProfile,
  weights: WeightConfig = DEFAULT_WEIGHTS
): Promise<ProgramScoreResult[]> {
  const programs = await getPrograms()

  // University lookup for coordinates
  const uniMap = new Map(programs.map(p => [p.universityId, p.university!]))

  const results: ProgramScoreResult[] = []

  for (const program of programs) {
    const university = uniMap.get(program.universityId)
    if (!university) continue

    // Calculate distance if home location provided
    let distance: number | undefined
    let distanceScore = 50

    if (profile.homeLocation) {
      const dist = haversineDistance(
        profile.homeLocation.lat,
        profile.homeLocation.lng,
        university.coordinates.lat,
        university.coordinates.lng
      )
      distance = dist

      if (dist > profile.distanceMax) {
        continue // Filter out programs beyond max distance
      }
      distanceScore = Math.max(0, 100 - (dist / profile.distanceMax) * 100)
    }

    // Calculate component scores
    const academicScore = Math.min(100, (profile.gpa + profile.mathLevel + profile.scienceLevel) / 3)
    
    const locationScore = scoreCitySize(preferenceToBucket(profile.preferredCitySize))
    
    let languageScore = 50
    if (program.language === 'english') {
      languageScore = profile.englishLevel
    } else if (program.language === 'local') {
      languageScore = profile.willingToLearnLocal
    } else {
      languageScore = Math.max(profile.englishLevel, profile.willingToLearnLocal * 0.7)
    }

    let budgetScore = 50
    if (program.tuitionEur === 0) {
      budgetScore = 100
    } else {
      const monthlyTuition = program.tuitionEur / 12
      if (monthlyTuition <= profile.monthlyBudget) {
        budgetScore = 75
      } else {
        budgetScore = Math.max(0, (profile.monthlyBudget / monthlyTuition) * 50)
      }
    }

    // Career score (field match - simplified)
    const careerScore = 50 // Could be enhanced with field matching

    // Calculate weighted total
    let totalScore = 
      academicScore * weights.academic +
      locationScore * weights.location +
      languageScore * weights.language +
      budgetScore * weights.budget +
      careerScore * weights.career

    // Apply distance penalty
    if (profile.homeLocation) {
      totalScore = totalScore * 0.85 + distanceScore * 0.15
    }

    // Determine match label
    let matchLabel = 'Low Match'
    if (totalScore >= 80) matchLabel = 'Excellent Match'
    else if (totalScore >= 60) matchLabel = 'Good Match'
    else if (totalScore >= 40) matchLabel = 'Moderate Match'

    results.push({
      program,
      score: Math.round(totalScore * 10) / 10,
      distance,
      breakdown: {
        academic: Math.round(academicScore),
        location: Math.round(locationScore),
        language: Math.round(languageScore),
        budget: Math.round(budgetScore),
        career: Math.round(careerScore),
      },
      matchLabel,
    })
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, 20) // Return top 20
}

// =============================================
// Utility Functions
// =============================================

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

type CityBucket = 'small' | 'med' | 'large'

function preferenceToBucket(pref: number): CityBucket {
  if (pref >= 70) return 'large'
  if (pref >= 40) return 'med'
  return 'small'
}

function scoreCitySize(bucket: CityBucket): number {
  const scores: Record<CityBucket, number> = {
    small: 30,
    med: 55,
    large: 85,
  }
  return scores[bucket]
}

// =============================================
// Admin / Migration Functions
// =============================================

export async function seedInitialData(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('[db] Supabase not configured, using mock data')
    return
  }

  console.log('[db] Seeding initial data to Supabase...')

  const refs = await loadReferenceData()

  // Seed universities
  for (const uni of mockUniversities) {
    const countryCode = getCountryCode(uni.country)
    const countryIdFinal = refs.countries.get(countryCode)

    if (!countryIdFinal) {
      console.warn(`[db] Country not found for: ${uni.country}`)
      continue
    }

    const slug = uni.id // Use legacy_id as slug for now

    const { error } = await supabase.from('universities').upsert({
      legacy_id: uni.id,
      name: uni.name,
      slug,
      country_id: countryIdFinal,
      city: uni.city,
      city_slug: uni.city.toLowerCase().replace(/\s+/g, '-'),
      latitude: uni.coordinates.lat,
      longitude: uni.coordinates.lng,
      website: uni.website,
      is_active: true,
    }, {
      onConflict: 'legacy_id',
    })

    if (error) {
      console.error(`[db] Error upserting university ${uni.id}:`, error)
    }
  }

  // Seed programs and versions
  for (const program of mockPrograms) {
    // Get university UUID
    const { data: uniData } = await supabase
      .from('universities')
      .select('id')
      .eq('legacy_id', program.universityId)
      .single()

    if (!uniData) {
      console.warn(`[db] University not found: ${program.universityId}`)
      continue
    }

    const fieldSlug = program.field.toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-')
    const fieldId = refs.studyFields.get(fieldSlug) || refs.studyFields.get('computer-science')
    const degreeId = refs.degreeTypes.get(program.degree) || refs.degreeTypes.get('bachelor')
    const instructionId = refs.instructionTypes.get(program.language) || refs.instructionTypes.get('english')
    const langId = refs.languages.get('en') // Default to English

    const programSlug = `${uniData.id}-${program.name.toLowerCase().replace(/\s+/g, '-')}`

    // Insert program
    const { data: programData, error: programError } = await supabase
      .from('programs')
      .upsert({
        legacy_id: program.id,
        university_id: uniData.id,
        name: program.name,
        slug: programSlug,
        field_id: fieldId,
        degree_type_id: degreeId,
        instruction_type_id: instructionId,
        primary_language_id: langId,
        description: program.description,
        is_active: true,
      }, {
        onConflict: 'legacy_id',
      })
      .select('id')
      .single()

    if (programError || !programData) {
      console.error(`[db] Error upserting program ${program.id}:`, programError)
      continue
    }

    // Insert current program version
    const { error: versionError } = await supabase.from('program_versions').upsert({
      program_id: programData.id,
      academic_year: '2026/27',
      effective_from: new Date('2026-09-01').toISOString().split('T')[0],
      is_current: true,
      ects: program.ects,
      duration_months: program.durationMonths,
      tuition_eur: program.tuitionEur,
      description: program.description,
      data_source: 'manual',
    }, {
      onConflict: 'program_id,academic_year',
    })

    if (versionError) {
      console.error(`[db] Error upserting program version for ${program.id}:`, versionError)
    }
  }

  console.log('[db] Seeding complete!')
}

function getCountryCode(countryName: string): string {
  const mapping: Record<string, string> = {
    'Slovakia': 'SVK',
    'Czech Republic': 'CZE',
    'Austria': 'AUT',
    'Poland': 'POL',
    'Hungary': 'HUN',
    'Germany': 'DEU',
    'Netherlands': 'NLD',
  }
  return mapping[countryName] || 'SVK'
}

export async function getLastUpdated(): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return new Date().toISOString().split('T')[0]
  }

  try {
    const { data } = await supabase
      .from('program_versions')
      .select('updated_at')
      .eq('is_current', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    return data?.updated_at 
      ? new Date(data.updated_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

export async function getStats(): Promise<Stats> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGetStats()
  }

  try {
    const [unisRes, programsRes, countriesRes, englishRes, freeRes] = await Promise.all([
      supabase.from('universities').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('programs').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('countries').select('id', { count: 'exact', head: true }),
      supabase.from('program_versions')
        .select('id', { count: 'exact', head: true })
        .eq('is_current', true)
        .eq('programs.instruction_type_id', supabase
          .from('instruction_types').select('id').eq('slug', 'english').single() as any),
      supabase.from('program_versions')
        .select('id', { count: 'exact', head: true })
        .eq('is_current', true)
        .eq('tuition_eur', 0),
    ])

    return {
      totalUniversities: unisRes.count || 0,
      totalPrograms: programsRes.count || 0,
      countries: countriesRes.count || 0,
      englishPrograms: englishRes.count || 0,
      freeTuition: freeRes.count || 0,
    }
  } catch {
    return mockGetStats()
  }
}
