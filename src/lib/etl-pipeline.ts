/**
 * EuroUni ETL Pipeline
 * File-based scraping and data sync
 *
 * Uses cheerio for HTML parsing (install: npm i cheerio @types/cheerio)
 * Rate limited: 1 request per 3 seconds per domain
 * Data stored in JSON files under /data/etl/
 */

import * as fs from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'

// Import types from mockData
interface Program {
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

// ============ Constants ============

const DATA_DIR = path.join(process.cwd(), 'data', 'etl')
const SCRAPED_DIR = path.join(DATA_DIR, 'scraped')
const META_DIR = path.join(DATA_DIR, 'meta')

const MIN_DELAY_MS = 3000 // 3 seconds between requests to same domain
const USER_AGENT = 'EuroUni/1.0 (educational research)'

// ============ Types ============

interface ScrapeMetadata {
  universityId: string
  url: string
  lastScrapeTime: string
  programCount: number
  success: boolean
  error?: string
}

// ============ Rate Limiter ============

// Track last request time per domain
const domainLastRequest: Map<string, number> = new Map()

/**
 * Rate-limited fetch with 3s delay per domain
 */
async function rateLimitedFetch(url: string, options?: RequestInit): Promise<string> {
  let domain: string
  try {
    domain = new URL(url).hostname
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }

  const now = Date.now()
  const lastRequest = domainLastRequest.get(domain) || 0
  const timeSinceLastRequest = now - lastRequest

  if (timeSinceLastRequest < MIN_DELAY_MS) {
    const waitTime = MIN_DELAY_MS - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  domainLastRequest.set(domain, Date.now())

  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.text()
}

// ============ Directory Management ============

function ensureDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(SCRAPED_DIR)) {
    fs.mkdirSync(SCRAPED_DIR, { recursive: true })
  }
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true })
  }
}

// ============ File Paths ============

function getScrapedFilePath(uniId: string): string {
  return path.join(SCRAPED_DIR, `${uniId}.json`)
}

function getMetaFilePath(uniId: string): string {
  return path.join(META_DIR, `${uniId}-meta.json`)
}

// ============ Main ETL Functions ============

/**
 * Scrape a university program page
 * Fetches HTML and parses with cheerio
 */
export async function scrapeUniversity(uniId: string, url: string): Promise<Partial<Program> | null> {
  try {
    console.log(`[ETL] Scraping ${uniId} from ${url}`)
    const html = await rateLimitedFetch(url)
    const programs = parseProgramPage(html, url)

    if (programs.length > 0) {
      // Return first program with universityId set
      return {
        ...programs[0],
        universityId: uniId,
      }
    }
    return null
  } catch (error) {
    console.error(`[ETL] Error scraping ${uniId}:`, error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Parse program page HTML using cheerio
 * Extracts program information from university pages
 */
export function parseProgramPage(html: string, url: string): Partial<Program>[] {
  const programs: Partial<Program>[] = []
  const $ = cheerio.load(html)

  // Common selectors for program listings
  // These would vary by university - this is a generic implementation
  const programSelectors = [
    '.program-item',
    '.study-program',
    '.course',
    '.programme-item',
    '[data-program]',
    '.degree-program',
    'article.program',
    '.offer-item',
  ]

  let foundPrograms = false

  for (const selector of programSelectors) {
    $(selector).each((_, el) => {
      foundPrograms = true
      const $el = $(el)

      // Try to extract program data
      const name = $el.find('h2, h3, .title, .name, [class*="title"]').first().text().trim()
      const degreeText = $el.find('.degree, [class*="degree"], .level').first().text().toLowerCase()
      const languageText = $el.find('.language, [class*="lang"], .teaching-lang').first().text().toLowerCase()
      const ectsText = $el.find('.ects, [class*="ects"]').first().text()
      const durationText = $el.find('.duration, [class*="duration"], .length').first().text()
      const tuitionText = $el.find('.tuition, [class*="tuition"], .fee').first().text()
      const description = $el.find('.description, .summary, [class*="desc"], p').first().text().trim()

      if (name) {
        const program: Partial<Program> = {
          name,
          description: description || '',
          field: extractField(name, description),
        }

        // Parse degree
        if (degreeText.includes('master') || degreeText.includes('msc') || degreeText.includes('ma')) {
          program.degree = 'master'
        } else if (degreeText.includes('bachelor') || degreeText.includes('bsc') || degreeText.includes('ba')) {
          program.degree = 'bachelor'
        }

        // Parse language
        if (languageText.includes('english')) {
          program.language = 'english'
        } else if (languageText.includes('german')) {
          program.language = 'german'
        } else if (languageText.includes('polish')) {
          program.language = 'polish'
        } else if (languageText.includes('hungarian')) {
          program.language = 'hungarian'
        } else if (languageText.includes('slovak')) {
          program.language = 'slovak'
        }

        // Parse ects
        const ectsMatch = ectsText.match(/(\d+)\s*ects/i)
        if (ectsMatch) {
          program.ects = parseInt(ectsMatch[1], 10)
        }

        // Parse duration (months)
        const durationMatch = durationText.match(/(\d+)\s*(month|year|semester)/i)
        if (durationMatch) {
          const value = parseInt(durationMatch[1], 10)
          if (durationMatch[2].toLowerCase().startsWith('year')) {
            program.durationMonths = value * 12
          } else if (durationMatch[2].toLowerCase().startsWith('semester')) {
            program.durationMonths = value * 6
          } else {
            program.durationMonths = value
          }
        }

        // Parse tuition
        const tuitionMatch = tuitionText.match(/(\d+)/)
        if (tuitionMatch) {
          program.tuitionEur = parseInt(tuitionMatch[1], 10)
        }

        programs.push(program)
      }
    })

    if (foundPrograms) break
  }

  // Fallback: if no structured data found, try to find any headings that look like programs
  if (programs.length === 0) {
    $('h1, h2, h3, h4').each((_, el) => {
      const text = $(el).text().trim()
      // Skip short titles and navigation
      if (text.length > 5 && text.length < 200 && !isNavigation(text)) {
        const program: Partial<Program> = {
          name: text,
          description: '',
          field: 'Unknown',
        }
        programs.push(program)
      }
    })
  }

  return programs
}

/**
 * Helper to determine field from name/description
 */
function extractField(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase()

  const fieldPatterns: [RegExp, string][] = [
    [/computer|science|software|programming|it|informatics|ai|artificial|data|web|cyber/i, 'Computer Science'],
    [/engineer|mechanical|electrical|civil|automotive|industrial/i, 'Engineering'],
    [/medicine|medical|pharmacy|nursing|health/i, 'Medicine'],
    [/law|legal|jurisprudence/i, 'Law'],
    [/business|management|economics|finance|accounting|marketing/i, 'Business'],
    [/math|statistics|stochastics/i, 'Mathematics'],
    [/physics|quantum|thermodynamics/i, 'Physics'],
    [/chemistry|biochemistry|organic|inorganic/i, 'Chemistry'],
    [/biology|bioinformatics|biotech/i, 'Biology'],
    [/psychology|counseling|behavior/i, 'Psychology'],
    [/architecture|urban|design/i, 'Architecture'],
    [/education|teaching|pedagogy/i, 'Education'],
  ]

  for (const [pattern, field] of fieldPatterns) {
    if (pattern.test(text)) {
      return field
    }
  }

  return 'General'
}

/**
 * Check if text looks like navigation rather than a program
 */
function isNavigation(text: string): boolean {
  const navPatterns = [
    /home|about|contact|search|menu|navigation|login|sign up/i,
    /^view all|read more|learn more|apply now/i,
    /^\s*(home|about|programs?|courses?)\s*$/i,
  ]
  return navPatterns.some(p => p.test(text))
}

/**
 * Save scraped programs to JSON file
 */
export function saveScrapedData(programs: Partial<Program>[], universityId: string): void {
  ensureDirectories()

  const filePath = getScrapedFilePath(universityId)
  const data = {
    universityId,
    programs,
    savedAt: new Date().toISOString(),
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[ETL] Saved ${programs.length} programs for ${universityId} to ${filePath}`)
}

/**
 * Load scraped programs from JSON file
 */
export function loadScrapedData(universityId: string): Partial<Program>[] {
  const filePath = getScrapedFilePath(universityId)

  if (!fs.existsSync(filePath)) {
    console.log(`[ETL] No scraped data found for ${universityId}`)
    return []
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)
    return data.programs || []
  } catch (error) {
    console.error(`[ETL] Error loading scraped data for ${universityId}:`, error)
    return []
  }
}

/**
 * Get last scrape time for a university
 */
export function getLastScrapeTime(universityId: string): Date | null {
  const metaPath = getMetaFilePath(universityId)

  if (!fs.existsSync(metaPath)) {
    return null
  }

  try {
    const content = fs.readFileSync(metaPath, 'utf-8')
    const meta: ScrapeMetadata = JSON.parse(content)
    return new Date(meta.lastScrapeTime)
  } catch (error) {
    console.error(`[ETL] Error reading metadata for ${universityId}:`, error)
    return null
  }
}

/**
 * Save metadata for a scrape operation
 */
export function saveScrapeMetadata(meta: ScrapeMetadata): void {
  ensureDirectories()

  const metaPath = getMetaFilePath(meta.universityId)
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
}

/**
 * Check if a university should be re-scraped based on data age
 */
export function shouldRescrape(universityId: string, maxAgeDays: number = 7): boolean {
  const lastScrape = getLastScrapeTime(universityId)

  if (!lastScrape) {
    return true
  }

  const now = Date.now()
  const ageMs = now - lastScrape.getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)

  return ageDays > maxAgeDays
}

/**
 * Full scrape pipeline for a single university
 */
export async function scrapeAndSave(uniId: string, url: string): Promise<{
  success: boolean
  programCount: number
  error?: string
}> {
  try {
    const html = await rateLimitedFetch(url)
    const programs = parseProgramPage(html, url)

    // Update programs with universityId
    const programsWithUniId = programs.map((p, index) => ({
      ...p,
      universityId: uniId,
      id: `${uniId}-scraped-${index}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    }))

    saveScrapedData(programsWithUniId, uniId)

    // Save metadata
    saveScrapeMetadata({
      universityId: uniId,
      url,
      lastScrapeTime: new Date().toISOString(),
      programCount: programsWithUniId.length,
      success: true,
    })

    return {
      success: true,
      programCount: programsWithUniId.length,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Save failed metadata
    saveScrapeMetadata({
      universityId: uniId,
      url,
      lastScrapeTime: new Date().toISOString(),
      programCount: 0,
      success: false,
      error: errorMessage,
    })

    return {
      success: false,
      programCount: 0,
      error: errorMessage,
    }
  }
}

/**
 * Get all scraped universities
 */
export function getAllScrapedUniversities(): string[] {
  ensureDirectories()

  if (!fs.existsSync(SCRAPED_DIR)) {
    return []
  }

  return fs.readdirSync(SCRAPED_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
}

/**
 * Clear scraped data for a university
 */
export function clearScrapedData(universityId: string): void {
  const scrapedPath = getScrapedFilePath(universityId)
  const metaPath = getMetaFilePath(universityId)

  if (fs.existsSync(scrapedPath)) {
    fs.unlinkSync(scrapedPath)
  }
  if (fs.existsSync(metaPath)) {
    fs.unlinkSync(metaPath)
  }
}

// Export for use in runner script
export default {
  scrapeUniversity,
  parseProgramPage,
  saveScrapedData,
  loadScrapedData,
  getLastScrapeTime,
  shouldRescrape,
  scrapeAndSave,
  getAllScrapedUniversities,
  clearScrapedData,
}
