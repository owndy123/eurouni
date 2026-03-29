/**
 * EuroUni Data Source System
 * 
 * This module handles dynamic data fetching from university websites.
 * In production, you would scrape university sites or use their APIs.
 * 
 * Architecture:
 * 1. Static: Current mock data (universities, programs)
 * 2. Dynamic: Live data fetching with caching
 * 3. Hybrid: Static data + periodic updates from sources
 */

// Cache configuration
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
const cache = new Map<string, { data: any; timestamp: number }>()

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  
  return entry.data
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * University data source URLs
 * These are real endpoints that could be used for live data
 */
export const DATA_SOURCES = {
  // Study in Germany
  germany: {
    search: 'https://www.study-in-germany.de/ajax/search',
    api: 'https://www.daad.de/api/expat/program',
  },
  // Study in Netherlands
  netherlands: {
    search: 'https://www.studyin.nl/api/search',
  },
  // Study in Austria
  austria: {
    search: 'https://www.studyinaustria.eu/api/programs',
  },
  // Study in Czech
  czech: {
    search: 'https://www.studyinczech.cz/api',
  },
  // Study in Slovakia
  slovakia: {
    search: 'https://www.studyinslovakia.eu/api',
  },
  // Study in Poland
  poland: {
    search: 'https://www.studyinpoland.pl/api',
  },
  // Study in Hungary
  hungary: {
    search: 'https://www.studyinhungary.hu/api',
  },
}

/**
 * Fetch programs from university APIs
 * In production, implement actual API calls with proper error handling
 */
export async function fetchProgramsFromSource(country: string): Promise<any[]> {
  const cacheKey = `programs_${country}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  // TODO: Implement actual API calls
  // Example:
  // const response = await fetch(DATA_SOURCES[country]?.search)
  // const data = await response.json()
  
  // For now, return empty - uses static data
  const data: any[] = []
  setCache(cacheKey, data)
  return data
}

/**
 * Check if data needs refresh
 */
export function needsRefresh(lastUpdated: string): boolean {
  const lastDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff > 30 // Refresh if older than 30 days
}

/**
 * Get data freshness status
 */
export function getDataFreshness(lastUpdated: string): 'fresh' | 'stale' | 'outdated' {
  const lastDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  
  if (daysDiff <= 7) return 'fresh'
  if (daysDiff <= 30) return 'stale'
  return 'outdated'
}

/**
 * Web scraping utilities (for future implementation)
 */
export const scraperConfig = {
  // Rate limiting
  rateLimit: {
    requestsPerMinute: 10,
    delayBetweenRequests: 6000,
  },
  
  // User agent
  userAgent: 'EuroUni/1.0 (educational research)',
  
  // Supported selectors for common university pages
  selectors: {
    programName: '.program-title, h1.program-name, [data-testid="program-title"]',
    degree: '.degree-type, .study-level, [data-degree]',
    language: '.language-of-instruction, .teaching-language',
    tuition: '.tuition-fee, .study-cost, [data-tuition]',
    duration: '.duration, .length-of-study, [data-duration]',
    ects: '.ects, .credits, [data-ects]',
    requirements: '.requirements, .admission-requirements, .entry-requirements',
  },
  
  // Common university domains to scrape
  universityDomains: [
    // Slovakia
    'stuba.sk', 'uniba.sk', 'ukf.sk', 'tuke.sk', 'upjs.sk',
    // Czech
    'cuni.cz', 'cvut.cz', 'vut.cz', 'muni.cz', 'cuzu.cz', 'upol.cz',
    // Austria
    'tuwien.ac.at', 'univie.ac.at', 'tugraz.at', 'jku.at', 'uibk.ac.at',
    // Poland
    'uw.edu.pl', 'pw.edu.pl', 'uj.edu.pl', 'agh.edu.pl', 'put.poznan.pl',
    // Hungary
    'elte.hu', 'bme.hu', 'semmelweis.hu', 'unideb.hu', 'pte.hu',
    // Germany
    'tum.de', 'tu-berlin.de', 'rwth-aachen.de', 'kit.edu',
    // Netherlands
    'uva.nl', 'tue.nl', 'tudelft.nl', 'leiden.nl', 'utwente.nl',
  ],
}

export default {
  DATA_SOURCES,
  fetchProgramsFromSource,
  needsRefresh,
  getDataFreshness,
  scraperConfig,
}
