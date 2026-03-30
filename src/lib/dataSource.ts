/**
 * EuroUni Data Source System
 *
 * Architecture:
 * 1. JSON file (data/programs.json) - source of truth with versioning
 * 2. In-memory cache with reload() for scraper integration
 *
 * The JSON file is the authoritative source. All code imports from here,
 * not from mockData.ts. This layer provides the same exports that pages
 * already expect (universities, programs, getUniversity, etc.) so the
 * transition is seamless.
 */

import * as fs from 'fs'
import * as path from 'path'

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

// ============ Internal JSON types ============

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

// ============ Data Loading ============

const DATA_FILE = path.join(process.cwd(), 'data', 'programs.json')

let _universities: University[] = []
let _programs: Program[] = []
let _jsonMeta: ProgramsJSON['meta'] | null = null

function loadFromJSON(): { universities: University[]; programs: Program[]; meta: ProgramsJSON['meta'] } {
  if (!fs.existsSync(DATA_FILE)) {
    // Fallback: try importing from mockData for dev scenarios
    console.warn(`[dataSource] ${DATA_FILE} not found, falling back to mockData`)
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mock = require('../data/mockData')
      return { universities: mock.universities, programs: mock.programs, meta: { lastUpdated: new Date().toISOString().split('T')[0], version: 'fallback' } }
    } catch {
      throw new Error(`[dataSource] No data source found. Run: node scripts/migrate-to-json.mjs`)
    }
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

// Initial load
try {
  const loaded = loadFromJSON()
  _universities = loaded.universities
  _programs = loaded.programs
  _jsonMeta = loaded.meta
} catch (e) {
  console.error('[dataSource] Initial load failed:', e)
}

// ============ Exports (same API as mockData.ts) ============

export const universities: University[] = _universities
export const programs: Program[] = _programs

export function getUniversity(id: string): University | undefined {
  return universities.find(u => u.id === id)
}

export function getProgramsForUniversity(universityId: string): Program[] {
  return programs.filter(p => p.universityId === universityId)
}

export function getProgramsByField(field: string): Program[] {
  return programs.filter(p => p.field.toLowerCase().includes(field.toLowerCase()))
}

export function getProgramsByLanguage(language: string): Program[] {
  return programs.filter(p => p.language === language)
}

export function getCountries(): string[] {
  return Array.from(new Set(universities.map(u => u.country)))
}

export function getStats() {
  return {
    totalUniversities: universities.length,
    totalPrograms: programs.length,
    countries: getCountries().length,
    englishPrograms: programs.filter(p => p.language === 'english').length,
    freeTuition: programs.filter(p => p.tuitionEur === 0).length,
  }
}

// ============ Logo helper (re-exported from universityLogos) ============

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { UNIVERSITY_LOGOS } = require('../data/universityLogos')

export function getLogo(uniId: string): string {
  return UNIVERSITY_LOGOS[uniId] || '🎓'
}

export function getUniversityWithLogo(id: string): University | undefined {
  const uni = universities.find(u => u.id === id)
  if (!uni) return undefined
  return { ...uni, logo: UNIVERSITY_LOGOS[uni.id] || uni.logo }
}

// ============ Reload function (for scraper integration) ============

/**
 * Reload data from the JSON file.
 * Called by the ETL/scraper pipeline after updating data/programs.json.
 */
export function reload(): void {
  const loaded = loadFromJSON()
  _universities = loaded.universities
  _programs = loaded.programs
  _jsonMeta = loaded.meta
  console.log(`[dataSource] Reloaded: ${_universities.length} universities, ${_programs.length} programs`)
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
}
