/**
 * EuroUni Data Source System
 * 
 * Architecture (tiered fallback):
 * 1. Supabase (production) - when NEXT_PUBLIC_SUPABASE_URL is configured
 * 2. JSON file (data/programs.json) - legacy versioning system
 * 3. Mock data (development) - fallback when nothing else is available
 *
 * All pages import from here. This layer provides the same exports that
 * pages already expect (universities, programs, getUniversity, etc.)
 * so the transition to Supabase is completely transparent.
 */

import { isSupabaseConfigured } from './supabase'

// Lazy load db module to avoid SSR issues with Supabase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbModule: any = null

async function getDb(): Promise<typeof import('./db')> {
  if (!dbModule) {
    dbModule = await import('./db')
  }
  return dbModule
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { UNIVERSITY_LOGOS } = require('../data/universityLogos')

// ============ Types (mirror mockData.ts interfaces) ============

export interface University {
  id: string
  name: string
  country: string
  city: string
  logo: string
  website: string
  coordinates: { lat: number; lng: number }
  lastUpdated: string
}

export interface Program {
  id: string
  universityId: string
  name: string
  degree: 'bachelor' | 'master'
  language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak'
  ects: number
  durationMonths: number
  tuitionEur: number
  description: string
  entryRequirements: string[]
  field: string
  lastUpdated: string
}

// ============ Internal JSON types (for JSON file fallback) ============

interface VersionedUniversity {
  id: string
  name: string
  country: string
  city: string
  logo: string
  website: string
  coordinates: { lat: number; lng: number }
  versions: Array<{
    version: string
    effectiveFrom: string
    effectiveTo: string | null
    data: Omit<University, 'id'>
  }>
}

interface VersionedProgram {
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
  versions: Array<{
    version: string
    effectiveFrom: string
    effectiveTo: string | null
    data: Omit<Program, 'id' | 'universityId'>
  }>
}

interface ProgramsJSON {
  universities: VersionedUniversity[]
  programs: VersionedProgram[]
  meta: {
    lastUpdated: string
    version: string
    migratedFrom?: string
  }
}

// ============ Data Storage ============

let _universities: University[] = []
let _programs: Program[] = []
let _jsonMeta: { lastUpdated: string; version: string } | null = null
let _dataMode: 'supabase' | 'json' | 'mock' = 'mock'
let _initialized = false

// ============ JSON File Loader ============

function loadFromJSONFile(): { universities: University[]; programs: Program[]; meta: { lastUpdated: string; version: string } } {
  // Dynamic import for Node.js modules (server-side only)
  const path = require('path')
  const fs = require('fs')
  
  const DATA_FILE = path.join(process.cwd(), 'data', 'programs.json')

  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`JSON data file not found: ${DATA_FILE}`)
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  const data: ProgramsJSON = JSON.parse(raw)

  // Extract current (latest) version of each university
  const universities: University[] = data.universities.map(uni => {
    const latestVersion = uni.versions.find(v => v.effectiveTo === null) ?? uni.versions[uni.versions.length - 1]
    return {
      id: uni.id,
      name: latestVersion.data.name,
      country: latestVersion.data.country,
      city: latestVersion.data.city,
      logo: latestVersion.data.logo,
      website: latestVersion.data.website,
      coordinates: latestVersion.data.coordinates,
      lastUpdated: latestVersion.data.lastUpdated,
    }
  })

  // Extract current (latest) version of each program
  const programs: Program[] = data.programs.map(prog => {
    const latestVersion = prog.versions.find(v => v.effectiveTo === null) ?? prog.versions[prog.versions.length - 1]
    return {
      id: prog.id,
      universityId: prog.universityId,
      name: latestVersion.data.name,
      degree: latestVersion.data.degree,
      language: latestVersion.data.language as Program['language'],
      ects: latestVersion.data.ects,
      durationMonths: latestVersion.data.durationMonths,
      tuitionEur: latestVersion.data.tuitionEur,
      description: latestVersion.data.description,
      entryRequirements: latestVersion.data.entryRequirements,
      field: latestVersion.data.field,
      lastUpdated: latestVersion.data.lastUpdated,
    }
  })

  return { universities, programs, meta: data.meta }
}

// ============ Mock Data Loader ============

function loadFromMockData(): { universities: University[]; programs: Program[]; meta: { lastUpdated: string; version: string } } {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mock = require('../data/mockData')
  return {
    universities: mock.universities,
    programs: mock.programs,
    meta: { lastUpdated: new Date().toISOString().split('T')[0], version: 'mock' },
  }
}

// ============ Initialization ============

function initialize(): void {
  if (_initialized) return

  // Try Supabase first (async only - can't await in module init)
  if (isSupabaseConfigured) {
    // Note: For SSR, we load mock data first and refresh async
    const mockData = loadFromMockData()
    _universities = mockData.universities
    _programs = mockData.programs
    _initialized = true
    
    // Schedule async Supabase load
    if (typeof window !== 'undefined') {
      // Client-side: refresh with Supabase data
      refreshFromSupabase().catch(console.error)
    } else if (process.env.NODE_ENV === 'development') {
      // Development server: refresh with Supabase data
      refreshFromSupabase().catch(console.error)
    }
    
    return
  }

  // Try JSON file
  try {
    const jsonData = loadFromJSONFile()
    _universities = jsonData.universities
    _programs = jsonData.programs
    _jsonMeta = jsonData.meta
    _dataMode = 'json'
    _initialized = true
    console.log('[dataSource] Loaded from JSON file')
    return
  } catch (e) {
    console.warn('[dataSource] JSON file not available:', (e as Error).message)
  }

  // Fallback to mock data
  const mockData = loadFromMockData()
  _universities = mockData.universities
  _programs = mockData.programs
  _jsonMeta = mockData.meta
  _dataMode = 'mock'
  _initialized = true
  console.log('[dataSource] Loaded from mock data')
}

async function refreshFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured) return
  
  try {
    const db = await getDb()
    const [unis, progs] = await Promise.all([
      db.getUniversities(),
      db.getPrograms(),
    ])
    _universities = unis
    _programs = progs
    _dataMode = 'supabase'
    console.log('[dataSource] Refreshed from Supabase')
  } catch (e) {
    console.warn('[dataSource] Supabase refresh failed:', e)
  }
}

// ============ Exports (same API as mockData.ts) ============

// Initialize immediately on module load
initialize()

export const universities: University[] = _universities
export const programs: Program[] = _programs

export function getUniversity(id: string): University | undefined {
  return _universities.find(u => u.id === id)
}

export function getProgramsForUniversity(universityId: string): Program[] {
  return _programs.filter(p => p.universityId === universityId)
}

export function getProgramsByField(field: string): Program[] {
  return _programs.filter(p => p.field.toLowerCase().includes(field.toLowerCase()))
}

export function getProgramsByLanguage(language: string): Program[] {
  return _programs.filter(p => p.language === language)
}

export function getCountries(): string[] {
  return Array.from(new Set(_universities.map(u => u.country)))
}

export function getStats() {
  return {
    totalUniversities: _universities.length,
    totalPrograms: _programs.length,
    countries: getCountries().length,
    englishPrograms: _programs.filter(p => p.language === 'english').length,
    freeTuition: _programs.filter(p => p.tuitionEur === 0).length,
  }
}

// ============ Logo helper ============

export function getLogo(uniId: string): string {
  return UNIVERSITY_LOGOS[uniId] || '🎓'
}

export function getUniversityWithLogo(id: string): University | undefined {
  const uni = _universities.find(u => u.id === id)
  if (!uni) return undefined
  return { ...uni, logo: UNIVERSITY_LOGOS[uni.id] || uni.logo }
}

// ============ Reload function (for scraper integration) ============

/**
 * Reload data from source.
 * When using Supabase, refreshes from database.
 * When using JSON, re-reads the file.
 */
export async function reload(): Promise<void> {
  if (isSupabaseConfigured) {
    await refreshFromSupabase()
  } else {
    // Try JSON file
    try {
      const jsonData = loadFromJSONFile()
      _universities = jsonData.universities
      _programs = jsonData.programs
      _jsonMeta = jsonData.meta
      _dataMode = 'json'
    } catch {
      // Fall back to mock
      const mockData = loadFromMockData()
      _universities = mockData.universities
      _programs = mockData.programs
      _jsonMeta = mockData.meta
      _dataMode = 'mock'
    }
  }
  console.log(`[dataSource] Reloaded (${_dataMode}): ${_universities.length} universities, ${_programs.length} programs`)
}

// ============ Legacy exports (for backward compat with etl-pipeline.ts) ============

export const DATA_SOURCES = {
  germany: { search: 'https://www.study-in-germany.de/ajax/search', api: 'https://www.daad.de/api/expat/program' },
  netherlands: { search: 'https://www.studyin.nl/api/search' },
  austria: { search: 'https://www.studyinaustria.eu/api/programs' },
  czech: { search: 'https://www.studyinczech.cz/api' },
  slovakia: { search: 'https://www.studyinslovakia.eu/api' },
  poland: { search: 'https://www.studyinpoland.pl/api' },
  hungary: { search: 'https://www.studyinhungary.hu/api' },
}

export function needsRefresh(lastUpdated: string): boolean {
  const lastDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff > 30
}

export function getDataFreshness(lastUpdated: string): 'fresh' | 'stale' | 'outdated' {
  const lastDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  if (daysDiff <= 7) return 'fresh'
  if (daysDiff <= 30) return 'stale'
  return 'outdated'
}

export const scraperConfig = {
  rateLimit: { requestsPerMinute: 10, delayBetweenRequests: 6000 },
  userAgent: 'EuroUni/1.0 (educational research)',
  selectors: {
    programName: '.program-title, h1.program-name, [data-testid="program-title"]',
    degree: '.degree-type, .study-level, [data-degree]',
    language: '.language-of-instruction, .teaching-language',
    tuition: '.tuition-fee, .study-cost, [data-tuition]',
    duration: '.duration, .length-of-study, [data-duration]',
    ects: '.ects, .credits, [data-ects]',
    requirements: '.requirements, .admission-requirements, .entry-requirements',
  },
  universityDomains: [
    'stuba.sk', 'uniba.sk', 'ukf.sk', 'tuke.sk', 'upjs.sk',
    'cuni.cz', 'cvut.cz', 'vut.cz', 'muni.cz', 'cuzu.cz', 'upol.cz',
    'tuwien.ac.at', 'univie.ac.at', 'tugraz.at', 'jku.at', 'uibk.ac.at',
    'uw.edu.pl', 'pw.edu.pl', 'uj.edu.pl', 'agh.edu.pl', 'put.poznan.pl',
    'elte.hu', 'bme.hu', 'semmelweis.hu', 'unideb.hu', 'pte.hu',
    'tum.de', 'tu-berlin.de', 'rwth-aachen.de', 'kit.edu',
    'uva.nl', 'tue.nl', 'tudelft.nl', 'leiden.nl', 'utwente.nl',
  ],
}

// Get current data mode (for debugging)
export function getDataMode(): 'supabase' | 'json' | 'mock' {
  return _dataMode
}

export default {
  universities,
  programs,
  getUniversity,
  getProgramsForUniversity,
  getProgramsByField,
  getProgramsByLanguage,
  getCountries,
  getStats,
  getLogo,
  getUniversityWithLogo,
  reload,
  DATA_SOURCES,
  needsRefresh,
  getDataFreshness,
  scraperConfig,
  getDataMode,
}
