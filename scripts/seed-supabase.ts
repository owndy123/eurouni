#!/usr/bin/env npx tsx
/**
 * EuroUni Seed Script for Supabase
 * 
 * Seeds the Supabase database with initial data from mockData.ts.
 * 
 * Usage:
 *   npx tsx scripts/seed-supabase.ts
 * 
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js'

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌱 EuroUni Seed Script')
console.log(`   Project: ${supabaseUrl}`)
console.log('')

// ============ Reference Data Mappings ============

const COUNTRY_CODE_MAP: Record<string, string> = {
  'Slovakia': 'SVK',
  'Czech Republic': 'CZE', 
  'Austria': 'AUT',
  'Poland': 'POL',
  'Hungary': 'HUN',
  'Germany': 'DEU',
  'Netherlands': 'NLD',
}

const LANGUAGE_CODE_MAP: Record<string, string> = {
  'english': 'en',
  'local': 'sk',
  'both': 'en',
  'german': 'de',
  'polish': 'pl',
  'hungarian': 'hu',
  'slovak': 'sk',
  'dutch': 'nl',
  'czech': 'cs',
}

const FIELD_SLUG_MAP: Record<string, string> = {
  'computer science': 'computer-science',
  'computer-science': 'computer-science',
  'engineering': 'engineering',
  'business': 'business',
  'business administration': 'business',
  'medicine': 'medicine',
  'medicine & health': 'medicine',
  'physics': 'physics',
  'mathematics': 'mathematics',
  'chemistry': 'chemistry',
  'biology': 'biology',
  'psychology': 'psychology',
  'law': 'law',
  'art & design': 'art',
  'art': 'art',
}

function normalizeField(field: string): string {
  const lower = field.toLowerCase()
  return FIELD_SLUG_MAP[lower] || lower.replace(/[^a-z]/g, '-').replace(/-+/g, '-')
}

// ============ Mock Data Imports ============

// We need to load the raw mock data directly since we can't use TypeScript imports in scripts easily
const path = require('path')
const fs = require('fs')

interface University {
  id: string
  name: string
  country: string
  city: string
  logo: string
  website: string
  coordinates: { lat: number; lng: number }
  lastUpdated: string
}

interface Program {
  id: string
  universityId: string
  name: string
  degree: 'bachelor' | 'master'
  language: string
  ects: number
  durationMonths: number
  tuitionEur: number
  description: string
  entryRequirements: string[]
  field: string
  lastUpdated: string
}

// Load mock data directly from the JSON
const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.ts')
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8')

// Parse the mockData.ts file to extract the arrays
// This is a simple parser since mockData.ts exports arrays directly

// For simplicity, we'll define the data inline - this matches the structure from mockData.ts
const MOCK_UNIVERSITIES: University[] = [
  // Slovakia
  { id: 'stuba', name: 'Slovak University of Technology in Bratislava', country: 'Slovakia', city: 'Bratislava', logo: '🎓', website: 'https://www.stuba.sk', coordinates: { lat: 48.1538, lng: 17.1071 }, lastUpdated: '2026-03-20' },
  { id: 'uniba', name: 'Comenius University in Bratislava', country: 'Slovakia', city: 'Bratislava', logo: '📚', website: 'https://www.uniba.sk', coordinates: { lat: 48.1409, lng: 17.1127 }, lastUpdated: '2026-03-20' },
  { id: 'ukf', name: 'Constantine the Philosopher University in Nitra', country: 'Slovakia', city: 'Nitra', logo: '🏛️', website: 'https://www.ukf.sk', coordinates: { lat: 48.3063, lng: 18.0865 }, lastUpdated: '2026-03-20' },
  { id: 'tuke', name: 'Technical University of Košice', country: 'Slovakia', city: 'Košice', logo: '⚙️', website: 'https://www.tuke.sk', coordinates: { lat: 48.7305, lng: 21.2489 }, lastUpdated: '2026-03-20' },
  { id: 'upjs', name: 'University of Pavol Jozef Šafárik in Košice', country: 'Slovakia', city: 'Košice', logo: '🔬', website: 'https://www.upjs.sk', coordinates: { lat: 48.7167, lng: 21.2333 }, lastUpdated: '2026-03-20' },
  // Czech Republic
  { id: 'cuni', name: 'Charles University', country: 'Czech Republic', city: 'Prague', logo: '👑', website: 'https://www.cuni.cz', coordinates: { lat: 50.0875, lng: 14.4214 }, lastUpdated: '2026-03-20' },
  { id: 'cvut', name: 'Czech Technical University in Prague', country: 'Czech Republic', city: 'Prague', logo: '⚡', website: 'https://www.cvut.cz', coordinates: { lat: 50.1028, lng: 14.3902 }, lastUpdated: '2026-03-20' },
  { id: 'vut-brno', name: 'Brno University of Technology', country: 'Czech Republic', city: 'Brno', logo: '🔧', website: 'https://www.vut.cz', coordinates: { lat: 49.2010, lng: 16.6068 }, lastUpdated: '2026-03-20' },
  { id: 'muni', name: 'Masaryk University', country: 'Czech Republic', city: 'Brno', logo: '🎓', website: 'https://www.muni.cz', coordinates: { lat: 49.1999, lng: 16.6068 }, lastUpdated: '2026-03-20' },
  // Austria
  { id: 'univie', name: 'University of Vienna', country: 'Austria', city: 'Vienna', logo: '🏰', website: 'https://www.univie.ac.at', coordinates: { lat: 48.2105, lng: 16.3599 }, lastUpdated: '2026-03-20' },
  { id: 'tuw', name: 'TU Wien', country: 'Austria', city: 'Vienna', logo: '⚙️', website: 'https://www.tuwien.ac.at', coordinates: { lat: 48.1986, lng: 16.3692 }, lastUpdated: '2026-03-20' },
  { id: 'tu-graz', name: 'Graz University of Technology', country: 'Austria', city: 'Graz', logo: '🔩', website: 'https://www.tugraz.at', coordinates: { lat: 47.0667, lng: 15.4500 }, lastUpdated: '2026-03-20' },
  { id: 'jku', name: 'Johannes Kepler University Linz', country: 'Austria', city: 'Linz', logo: '📊', website: 'https://www.jku.at', coordinates: { lat: 48.3333, lng: 14.2833 }, lastUpdated: '2026-03-20' },
  { id: 'uibk', name: 'University of Innsbruck', country: 'Austria', city: 'Innsbruck', logo: '🏔️', website: 'https://www.uibk.ac.at', coordinates: { lat: 47.2692, lng: 11.4041 }, lastUpdated: '2026-03-20' },
  // Poland
  { id: 'uw', name: 'University of Warsaw', country: 'Poland', city: 'Warsaw', logo: '📚', website: 'https://www.uw.edu.pl', coordinates: { lat: 52.2391, lng: 21.0206 }, lastUpdated: '2026-03-20' },
  { id: 'pw', name: 'Warsaw University of Technology', country: 'Poland', city: 'Warsaw', logo: '🔧', website: 'https://www.pw.edu.pl', coordinates: { lat: 52.2190, lng: 21.0138 }, lastUpdated: '2026-03-20' },
  { id: 'uj', name: 'Jagiellonian University', country: 'Poland', city: 'Kraków', logo: '👑', website: 'https://www.uj.edu.pl', coordinates: { lat: 50.0579, lng: 19.9492 }, lastUpdated: '2026-03-20' },
  { id: 'agh', name: 'AGH University of Science and Technology', country: 'Poland', city: 'Kraków', logo: '⚒️', website: 'https://www.agh.edu.pl', coordinates: { lat: 50.0657, lng: 19.9230 }, lastUpdated: '2026-03-20' },
  // Hungary
  { id: 'elte', name: 'Eötvös Loránd University', country: 'Hungary', city: 'Budapest', logo: '📚', website: 'https://www.elte.hu', coordinates: { lat: 47.4908, lng: 19.0617 }, lastUpdated: '2026-03-20' },
  { id: 'bme', name: 'Budapest University of Technology and Economics', country: 'Hungary', city: 'Budapest', logo: '⚙️', website: 'https://www.bme.hu', coordinates: { lat: 47.4739, lng: 19.0577 }, lastUpdated: '2026-03-20' },
  { id: 'semmelweis', name: 'Semmelweis University', country: 'Hungary', city: 'Budapest', logo: '⚕️', website: 'https://www.semmelweis.hu', coordinates: { lat: 47.5068, lng: 19.0729 }, lastUpdated: '2026-03-20' },
  // Germany
  { id: 'tum', name: 'Technical University of Munich', country: 'Germany', city: 'Munich', logo: '🎓', website: 'https://www.tum.de', coordinates: { lat: 48.1351, lng: 11.5820 }, lastUpdated: '2026-03-20' },
  { id: 'lmu', name: 'Ludwig Maximilian University of Munich', country: 'Germany', city: 'Munich', logo: '🎓', website: 'https://www.lmu.de', coordinates: { lat: 48.1497, lng: 11.5678 }, lastUpdated: '2026-03-20' },
  { id: 'tu-berlin', name: 'TU Berlin', country: 'Germany', city: 'Berlin', logo: '🎓', website: 'https://www.tu-berlin.de', coordinates: { lat: 52.5113, lng: 13.4025 }, lastUpdated: '2026-03-20' },
  // Netherlands
  { id: 'tue', name: 'TU Eindhoven', country: 'Netherlands', city: 'Eindhoven', logo: '🎓', website: 'https://www.tue.nl', coordinates: { lat: 51.4481, lng: 5.4877 }, lastUpdated: '2026-03-20' },
  { id: 'tu-delft', name: 'TU Delft', country: 'Netherlands', city: 'Delft', logo: '🎓', website: 'https://www.tudelft.nl', coordinates: { lat: 51.9990, lng: 4.3730 }, lastUpdated: '2026-03-20' },
  { id: 'uva', name: 'University of Amsterdam', country: 'Netherlands', city: 'Amsterdam', logo: '🎓', website: 'https://www.uva.nl', coordinates: { lat: 52.3555, lng: 4.9555 }, lastUpdated: '2026-03-20' },
]

const MOCK_PROGRAMS: Program[] = [
  // STUBA - Slovakia
  { id: 'stuba-cs', universityId: 'stuba', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 0, description: 'Study Computer Science at STUBA in Bratislava.', entryRequirements: ['Math proficiency', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'stuba-is', universityId: 'stuba', name: 'Information Systems', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 0, description: 'Information Systems management.', entryRequirements: ['CS bachelor', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  // CUNI - Czech Republic
  { id: 'cuni-cs', universityId: 'cuni', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 5000, description: 'CS at Charles University in Prague.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'cuni-math', universityId: 'cuni', name: 'Mathematics', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 5000, description: 'Pure and Applied Mathematics.', entryRequirements: ['Math proficiency', 'English B2'], field: 'Mathematics', lastUpdated: '2026-03-20' },
  { id: 'cuni-phys', universityId: 'cuni', name: 'Physics', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 5000, description: 'General Physics program.', entryRequirements: ['Math', 'Physics', 'English B2'], field: 'Physics', lastUpdated: '2026-03-20' },
  // TUW - Austria
  { id: 'tuw-cs', universityId: 'tuw', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 0, description: 'CS at TU Wien.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'tuw-me', universityId: 'tuw', name: 'Mechanical Engineering', degree: 'bachelor', language: 'german', ects: 180, durationMonths: 36, tuitionEur: 0, description: 'Mechanical Engineering in German.', entryRequirements: ['Math', 'Physics', 'German B2'], field: 'Engineering', lastUpdated: '2026-03-20' },
  // UNIVIE - Austria
  { id: 'univie-cs', universityId: 'univie', name: 'Computer Science', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 0, description: 'Advanced CS at University of Vienna.', entryRequirements: ['CS bachelor', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'univie-psych', universityId: 'univie', name: 'Psychology', degree: 'bachelor', language: 'german', ects: 180, durationMonths: 36, tuitionEur: 0, description: 'Psychology in German.', entryRequirements: ['German C1'], field: 'Psychology', lastUpdated: '2026-03-20' },
  // UW - Poland
  { id: 'uw-cs', universityId: 'uw', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 8000, description: 'CS at University of Warsaw.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'uw-law', universityId: 'uw', name: 'Law', degree: 'bachelor', language: 'polish', ects: 180, durationMonths: 36, tuitionEur: 10000, description: 'Law in Polish.', entryRequirements: ['Polish C1', 'History'], field: 'Law', lastUpdated: '2026-03-20' },
  // AGH - Poland
  { id: 'agh-cs', universityId: 'agh', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 6000, description: 'CS at AGH Kraków.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'agh-eng', universityId: 'agh', name: 'Engineering', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 6000, description: 'Various engineering specializations.', entryRequirements: ['Engineering bachelor', 'English B2'], field: 'Engineering', lastUpdated: '2026-03-20' },
  // ELTE - Hungary
  { id: 'elte-cs', universityId: 'elte', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 8000, description: 'CS at Eötvös Loránd University.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'elte-psych', universityId: 'elte', name: 'Psychology', degree: 'master', language: 'hungarian', ects: 120, durationMonths: 24, tuitionEur: 8000, description: 'Psychology in Hungarian.', entryRequirements: ['Psych bachelor', 'Hungarian C1'], field: 'Psychology', lastUpdated: '2026-03-20' },
  // BME - Hungary
  { id: 'bme-eng', universityId: 'bme', name: 'Mechanical Engineering', degree: 'bachelor', language: 'hungarian', ects: 240, durationMonths: 48, tuitionEur: 8000, description: 'Mechanical Engineering at BME.', entryRequirements: ['Math', 'Physics', 'Hungarian B2'], field: 'Engineering', lastUpdated: '2026-03-20' },
  { id: 'bme-cs', universityId: 'bme', name: 'Computer Science', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 8000, description: 'CS at Budapest University of Technology.', entryRequirements: ['CS bachelor', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  // TUM - Germany
  { id: 'tum-cs', universityId: 'tum', name: 'Computer Science', degree: 'bachelor', language: 'german', ects: 180, durationMonths: 36, tuitionEur: 0, description: 'CS at Technical University of Munich.', entryRequirements: ['Math', 'German C1'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'tum-robotics', universityId: 'tum', name: 'Robotics', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 0, description: 'Robotics and Automation.', entryRequirements: ['Engineering/CS bachelor', 'English B2'], field: 'Engineering', lastUpdated: '2026-03-20' },
  // TU DELFT - Netherlands
  { id: 'tud-cs', universityId: 'tu-delft', name: 'Computer Science', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 15000, description: 'CS at TU Delft.', entryRequirements: ['Math', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'tud-arch', universityId: 'tu-delft', name: 'Architecture', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 15000, description: 'Architecture and Built Environment.', entryRequirements: ['Arch bachelor', 'English B2', 'Portfolio'], field: 'Art', lastUpdated: '2026-03-20' },
  // UvA - Netherlands
  { id: 'uva-cs', universityId: 'uva', name: 'Computer Science', degree: 'master', language: 'english', ects: 120, durationMonths: 24, tuitionEur: 15000, description: 'CS at University of Amsterdam.', entryRequirements: ['CS bachelor', 'English B2'], field: 'Computer Science', lastUpdated: '2026-03-20' },
  { id: 'uva-business', universityId: 'uva', name: 'Business Administration', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 15000, description: 'Business in English.', entryRequirements: ['English B2'], field: 'Business', lastUpdated: '2026-03-20' },
]

// ============ Seed Functions ============

async function seedReferenceTables(): Promise<void> {
  console.log('📋 Seeding reference tables...')

  // Countries
  const countries = [
    { code: 'SVK', name: 'Slovakia', region: 'Central Europe' },
    { code: 'CZE', name: 'Czech Republic', region: 'Central Europe' },
    { code: 'AUT', name: 'Austria', region: 'Central Europe' },
    { code: 'POL', name: 'Poland', region: 'Central Europe' },
    { code: 'HUN', name: 'Hungary', region: 'Central Europe' },
    { code: 'DEU', name: 'Germany', region: 'Western Europe' },
    { code: 'NLD', name: 'Netherlands', region: 'Western Europe' },
  ]

  for (const country of countries) {
    const { error } = await supabase.from('countries').upsert(country, { onConflict: 'code' })
    if (error) console.error(`   Error upserting country ${country.code}:`, error.message)
  }
  console.log('   ✅ Countries seeded')

  // Languages
  const languages = [
    { code: 'en', name: 'English', is_local: false },
    { code: 'de', name: 'German', is_local: true },
    { code: 'sk', name: 'Slovak', is_local: true },
    { code: 'cs', name: 'Czech', is_local: true },
    { code: 'pl', name: 'Polish', is_local: true },
    { code: 'hu', name: 'Hungarian', is_local: true },
    { code: 'nl', name: 'Dutch', is_local: true },
  ]

  for (const lang of languages) {
    const { error } = await supabase.from('languages').upsert(lang, { onConflict: 'code' })
    if (error) console.error(`   Error upserting language ${lang.code}:`, error.message)
  }
  console.log('   ✅ Languages seeded')

  // Degree types
  const degreeTypes = [
    { slug: 'bachelor', name: 'Bachelor', level: 6 },
    { slug: 'master', name: 'Master', level: 7 },
  ]

  for (const dt of degreeTypes) {
    const { error } = await supabase.from('degree_types').upsert(dt, { onConflict: 'slug' })
    if (error) console.error(`   Error upserting degree type ${dt.slug}:`, error.message)
  }
  console.log('   ✅ Degree types seeded')

  // Instruction types
  const instructionTypes = [
    { slug: 'english', name: 'English Taught', description: 'Program taught entirely in English' },
    { slug: 'local', name: 'Local Language', description: 'Program taught in local language' },
    { slug: 'both', name: 'Mixed', description: 'Program available in both English and local language' },
  ]

  for (const it of instructionTypes) {
    const { error } = await supabase.from('instruction_types').upsert(it, { onConflict: 'slug' })
    if (error) console.error(`   Error upserting instruction type ${it.slug}:`, error.message)
  }
  console.log('   ✅ Instruction types seeded')

  // Study fields
  const studyFields = [
    { slug: 'computer-science', name: 'Computer Science', keywords: ['cs', 'computing', 'software', 'it'] },
    { slug: 'engineering', name: 'Engineering', keywords: ['mechanical', 'electrical', 'civil'] },
    { slug: 'business', name: 'Business & Economics', keywords: ['management', 'finance', 'marketing'] },
    { slug: 'mathematics', name: 'Mathematics', keywords: ['stats', 'statistics', 'applied-math'] },
    { slug: 'physics', name: 'Physics', keywords: ['astrophysics', 'quantum'] },
    { slug: 'psychology', name: 'Psychology', keywords: ['counseling', 'cognitive'] },
    { slug: 'law', name: 'Law', keywords: ['legal', 'jurisprudence'] },
    { slug: 'art', name: 'Art & Design', keywords: ['design', 'fine-arts'] },
  ]

  for (const sf of studyFields) {
    const { error } = await supabase.from('study_fields').upsert(sf, { onConflict: 'slug' })
    if (error) console.error(`   Error upserting study field ${sf.slug}:`, error.message)
  }
  console.log('   ✅ Study fields seeded')
}

async function getReferenceIds(): Promise<{
  countries: Map<string, string>
  languages: Map<string, string>
  degreeTypes: Map<string, string>
  instructionTypes: Map<string, string>
  studyFields: Map<string, string>
}> {
  const [countriesRes, languagesRes, degreeTypesRes, instructionTypesRes, studyFieldsRes] = await Promise.all([
    supabase.from('countries').select('id, code'),
    supabase.from('languages').select('id, code'),
    supabase.from('degree_types').select('id, slug'),
    supabase.from('instruction_types').select('id, slug'),
    supabase.from('study_fields').select('id, slug'),
  ])

  return {
    countries: new Map(countriesRes.data?.map(c => [c.code, c.id]) || []),
    languages: new Map(languagesRes.data?.map(l => [l.code, l.id]) || []),
    degreeTypes: new Map(degreeTypesRes.data?.map(d => [d.slug, d.id]) || []),
    instructionTypes: new Map(instructionTypesRes.data?.map(i => [i.slug, i.id]) || []),
    studyFields: new Map(studyFieldsRes.data?.map(s => [s.slug, s.id]) || []),
  }
}

async function seedUniversities(refs: Awaited<ReturnType<typeof getReferenceIds>>): Promise<void> {
  console.log('🏛️  Seeding universities...')

  for (const uni of MOCK_UNIVERSITIES) {
    const countryCode = COUNTRY_CODE_MAP[uni.country]
    const countryId = refs.countries.get(countryCode)

    if (!countryId) {
      console.warn(`   ⚠️  Country not found for: ${uni.country}`)
      continue
    }

    const { error } = await supabase.from('universities').upsert({
      legacy_id: uni.id,
      name: uni.name,
      slug: uni.id,
      country_id: countryId,
      city: uni.city,
      city_slug: uni.city.toLowerCase().replace(/\s+/g, '-'),
      latitude: uni.coordinates.lat,
      longitude: uni.coordinates.lng,
      website: uni.website,
      logo_url: uni.logo,
      is_active: true,
    }, { onConflict: 'legacy_id' })

    if (error) {
      console.error(`   Error upserting university ${uni.id}:`, error.message)
    }
  }

  console.log(`   ✅ ${MOCK_UNIVERSITIES.length} universities seeded`)
}

async function seedPrograms(refs: Awaited<ReturnType<typeof getReferenceIds>>): Promise<void> {
  console.log('📚 Seeding programs and versions...')

  for (const program of MOCK_PROGRAMS) {
    // Get university UUID
    const { data: uniData } = await supabase
      .from('universities')
      .select('id')
      .eq('legacy_id', program.universityId)
      .single()

    if (!uniData) {
      console.warn(`   ⚠️  University not found: ${program.universityId}`)
      continue
    }

    // Map program data to reference IDs
    const fieldSlug = normalizeField(program.field)
    const fieldId = refs.studyFields.get(fieldSlug) || refs.studyFields.get('computer-science')
    const degreeId = refs.degreeTypes.get(program.degree) || refs.degreeTypes.get('bachelor')
    const langCode = LANGUAGE_CODE_MAP[program.language] || 'en'
    const langId = refs.languages.get(langCode) || refs.languages.get('en')

    // Determine instruction type
    let instructionTypeSlug = 'english'
    if (program.language === 'local' || program.language === 'german' || program.language === 'polish' || program.language === 'hungarian' || program.language === 'slovak') {
      instructionTypeSlug = 'local'
    }
    const instructionTypeId = refs.instructionTypes.get(instructionTypeSlug) || refs.instructionTypes.get('english')

    if (!fieldId || !degreeId || !langId || !instructionTypeId) {
      console.warn(`   ⚠️  Missing reference IDs for program ${program.id}: field=${fieldId}, degree=${degreeId}, lang=${langId}, instruction=${instructionTypeId}`)
      continue
    }

    // Insert program
    const programSlug = `${uniData.id}-${program.name.toLowerCase().replace(/\s+/g, '-')}`

    const { data: programData, error: programError } = await supabase
      .from('programs')
      .upsert({
        legacy_id: program.id,
        university_id: uniData.id,
        name: program.name,
        slug: programSlug,
        field_id: fieldId,
        degree_type_id: degreeId,
        instruction_type_id: instructionTypeId,
        primary_language_id: langId,
        description: program.description,
        is_active: true,
      }, { onConflict: 'legacy_id' })
      .select('id')
      .single()

    if (programError || !programData) {
      console.error(`   Error upserting program ${program.id}:`, programError?.message)
      continue
    }

    // Insert current program version
    const { error: versionError } = await supabase.from('program_versions').upsert({
      program_id: programData.id,
      academic_year: '2026/27',
      effective_from: '2026-09-01',
      is_current: true,
      ects: program.ects,
      duration_months: program.durationMonths,
      tuition_eur: program.tuitionEur,
      description: program.description,
      data_source: 'manual',
    }, { onConflict: 'program_id,academic_year' })

    if (versionError) {
      console.error(`   Error upserting program version for ${program.id}:`, versionError.message)
    }
  }

  console.log(`   ✅ ${MOCK_PROGRAMS.length} programs seeded with current versions`)
}

// ============ Main ============

async function main(): Promise<void> {
  try {
    console.log('🔍 Checking database connection...')
    const { error: healthError } = await supabase.from('countries').select('count')
    if (healthError) {
      console.error('❌ Database connection failed:', healthError.message)
      console.error('   Make sure you have run scripts/setup-supabase.sql first!')
      process.exit(1)
    }
    console.log('   ✅ Connected to Supabase\n')

    console.log('📦 Seeding reference tables...')
    await seedReferenceTables()
    console.log('')

    console.log('📊 Loading reference IDs...')
    const refs = await getReferenceIds()
    console.log(`   ✅ Found ${refs.countries.size} countries, ${refs.languages.size} languages, etc.\n`)

    console.log('🏛️  Seeding universities...')
    await seedUniversities(refs)
    console.log('')

    console.log('📚 Seeding programs...')
    await seedPrograms(refs)
    console.log('')

    console.log('🎉 Seeding complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Copy .env.local.example to .env.local')
    console.log('2. Add your Supabase URL and anon key to .env.local')
    console.log('3. Restart your Next.js development server')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
