/**
 * EuroUni ETL Runner Script
 * Run: npx tsx scripts/run-etl.ts
 * Run with force: npx tsx scripts/run-etl.ts --force
 *
 * The ETL pipeline:
 * 1. Scrapes university websites for program data
 * 2. Validates and normalizes the scraped data
 * 3. Writes updated data to data/programs.json
 * 4. Reloads the data source
 *
 * Country scrapers are implemented as stub functions below.
 * Each stub logs a "not yet implemented" message.
 * To implement a real scraper, replace the stub body with actual
 * Playwright/cheerio logic for that country's universities.
 */

import { scrapeAndSave, shouldRescrape, loadScrapedData, getLastScrapeTime } from '../src/lib/etl-pipeline'
import { universities, reload } from '../src/lib/dataSource'
import { scrapeSlovakia as realScrapeSlovakia } from './countries/slovakia'
import { scrapeCzech as realScrapeCzechRep } from './countries/czech'

// University program URLs — map university IDs to their program listing URLs
const UNIVERSITY_PROGRAM_URLS: Record<string, string> = {
  // Slovakia
  'stuba': 'https://www.stuba.sk/sk/fakulta.html',
  'uniba': 'https://www.uniba.sk/en/',
  'ukf': 'https://www.ukf.sk/en/',
  'tuke': 'https://www.tuke.sk/en/',
  'upjs': 'https://www.upjs.sk/en/',
  'tu-zvolen': 'https://www.tuzvo.sk/en/',
  'uvm': 'https://www.uvm.sk/en/',
  'akademia': 'https://www.akademia.sk/en/',
  // Czech Republic
  'cuni': 'https://cuni.cz/UKEN_313.html',
  'cvut': 'https://www.cvut.cz/en/',
  'vut-brno': 'https://www.vut.cz/en/',
  'muni': 'https://www.muni.cz/en/',
  'czu': 'https://www.czu.cz/en/',
  'upol': 'https://www.upol.cz/en/',
  'osu': 'https://www.osu.cz/en/',
  'utb': 'https://www.utb.cz/en/',
  'ujep': 'https://www.ujep.cz/en/',
  'uwb': 'https://www.zcu.cz/en/',
  // Austria
  'univie': 'https://www.univie.ac.at/en/studies/',
  'tuw': 'https://www.tuwien.ac.at/en/studies',
  'tu-graz': 'https://www.tugraz.at/en/study',
  'jku': 'https://www.jku.at/en/study/',
  'uibk': 'https://www.uibk.ac.at/en/studies/',
  'sbg': 'https://www.plus.ac.at/en/study/',
  'wu-wien': 'https://www.wu.ac.at/en/study/',
  'mu-wien': 'https://www.meduniwien.ac.at/en/study/',
  // Poland
  'uw': 'https://www.uw.edu.pl/en/education/',
  'pw': 'https://www.pw.edu.pl/en/Studies',
  'uj': 'https://www.uj.edu.pl/en/Studies',
  'agh': 'https://www.agh.edu.pl/en/education/',
  'put': 'https://www.put.poznan.pl/en/education',
  'amu': 'https://www.amu.edu.pl/en/education',
  'uw-edu': 'https://www.uw.edu.pl/en/education/',
  'pwr': 'https://www.pwr.edu.pl/en/education/',
  'ug': 'https://www.ug.edu.pl/en/education/',
  'pg': 'https://www.pg.edu.pl/en/education/',
  // Hungary
  'elte': 'https://www.elte.hu/en/',
  'bme': 'https://www.bme.hu/en/education',
  'elte-ik': 'https://www.inf.elte.hu/en/',
  'semmelweis': 'https://www.semmelweis.hu/en/education/',
  'uni-miskolc': 'https://www.uni-miskolc.hu/en/education/',
  'pte': 'https://www.pte.hu/en/education/',
  'szte': 'https://www.u-szeged.hu/en/education/',
  'debrecen': 'https://www.unideb.hu/en/education/',
  // Germany
  'tum': 'https://www.tum.de/en/studies/degree-programs',
  'tum-wsi': 'https://www.wsi.tum.de/en/study/',
  'tu-berlin': 'https://www.tu.berlin/en/studies/',
  'rwth': 'https://www.rwth-aachen.de/en/studies/',
  'kit': 'https://www.kit.edu/en/studies/',
  'tum-phy': 'https://www.ph.tum.de/en/studies/',
  'fub': 'https://www.fu-berlin.de/en/studies/',
  'hu-berlin': 'https://www.hu-berlin.de/en/studies/',
  'lmu': 'https://www.lmu.de/en/studies/',
  'heidelberg': 'https://www.uni-heidelberg.de/en/studies/',
  // Netherlands
  'uva': 'https://www.uva.nl/en/programmes',
  'tue': 'https://www.tue.nl/en/education/',
  'tudelft': 'https://www.tudelft.nl/en/education/',
  'leiden': 'https://www.universiteitleiden.nl/en/education/',
  'utwente': 'https://www.utwente.nl/en/education/',
  'rug': 'https://www.rug.nl/en/education/',
  'vu': 'https://www.vu.nl/en/education/',
  'radboud': 'https://www.ru.nl/en/education/',
}

interface ScrapeResult {
  universityId: string
  success: boolean
  programCount: number
  skipped: boolean
  error?: string
}

// ============ Country Scraper Stubs ============
//
// Each scraper function handles all universities in a given country.
// Replace the stub body with real Playwright/cheerio scraping logic.
//
// The expected pattern for each scraper:
// 1. Fetch the main university listings page
// 2. Parse program cards using country-specific selectors
// 3. Normalize data to Program interface
// 4. Merge with existing JSON data
// 5. Write back to data/programs.json

async function scrapeSlovakia(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Slovakia — running real scraper...')
  const fs = await import('fs')
  const path = await import('path')

  let programs: import('./countries/slovakia').Program[] = []
  try {
    programs = await realScrapeSlovakia()
  } catch (err) {
    console.error('[SCRAPER] Slovakia scraper crashed:', err instanceof Error ? err.message : String(err))
    return universities.filter(u => u.country === 'Slovakia').map(uni => ({
      universityId: uni.id, success: false, programCount: 0, skipped: false,
      error: err instanceof Error ? err.message : String(err),
    }))
  }

  const results: ScrapeResult[] = []

  // Group programs by universityId
  const byUni = new Map<string, import('./countries/slovakia').Program[]>()
  for (const p of programs) {
    if (!byUni.has(p.universityId)) byUni.set(p.universityId, [])
    byUni.get(p.universityId)!.push(p)
  }

  for (const [uniId, progs] of byUni) {
    results.push({ universityId: uniId, success: true, programCount: progs.length, skipped: false })

    // Save to ETL scraped data dir
    const scrapedDir = path.join(process.cwd(), 'data', 'etl', 'scraped')
    if (!fs.existsSync(scrapedDir)) fs.mkdirSync(scrapedDir, { recursive: true })
    fs.writeFileSync(
      path.join(scrapedDir, `${uniId}.json`),
      JSON.stringify({ universityId: uniId, programs: progs, savedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    )
  }

  // Merge into programs.json
  try {
    const programsPath = path.join(process.cwd(), 'data', 'programs.json')
    const existing = JSON.parse(fs.readFileSync(programsPath, 'utf-8'))
    const existingProgramIds = new Set(existing.programs.map((p: { id: string }) => p.id))

    // Remove old Slovak programs and add new ones
    existing.programs = existing.programs.filter((p: { universityId: string }) => p.universityId && !['stuba','uniba','ukf','tuke','upjs','tu-zvolen','uvm','akademia'].includes(p.universityId))
    const newProgs = programs.filter((p: import('./countries/slovakia').Program) => !existingProgramIds.has(p.id))
    existing.programs.push(...newProgs)
    existing.meta.lastUpdated = new Date().toISOString()
    fs.writeFileSync(programsPath, JSON.stringify(existing, null, 2), 'utf-8')
    console.log(`[SCRAPER] Slovakia — merged ${newProgs.length} new programs into data/programs.json`)
  } catch (err) {
    console.warn('[SCRAPER] Could not merge into programs.json:', err instanceof Error ? err.message : String(err))
  }

  return results
}

async function scrapeCzech(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Czech Republic — running real scraper...')
  const fs = await import('fs')
  const path = await import('path')

  let programs: import('./countries/czech').Program[] = []
  try {
    programs = await realScrapeCzechRep()
  } catch (err) {
    console.error('[SCRAPER] Czech scraper crashed:', err instanceof Error ? err.message : String(err))
    return universities.filter(u => u.country === 'Czech Republic').map(uni => ({
      universityId: uni.id, success: false, programCount: 0, skipped: false,
      error: err instanceof Error ? err.message : String(err),
    }))
  }

  const results: ScrapeResult[] = []

  const byUni = new Map<string, import('./countries/czech').Program[]>()
  for (const p of programs) {
    if (!byUni.has(p.universityId)) byUni.set(p.universityId, [])
    byUni.get(p.universityId)!.push(p)
  }

  for (const [uniId, progs] of byUni) {
    results.push({ universityId: uniId, success: true, programCount: progs.length, skipped: false })

    const scrapedDir = path.join(process.cwd(), 'data', 'etl', 'scraped')
    if (!fs.existsSync(scrapedDir)) fs.mkdirSync(scrapedDir, { recursive: true })
    fs.writeFileSync(
      path.join(scrapedDir, `${uniId}.json`),
      JSON.stringify({ universityId: uniId, programs: progs, savedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    )
  }

  try {
    const programsPath = path.join(process.cwd(), 'data', 'programs.json')
    const existing = JSON.parse(fs.readFileSync(programsPath, 'utf-8'))
    const existingProgramIds = new Set(existing.programs.map((p: { id: string }) => p.id))
    existing.programs = existing.programs.filter((p: { universityId: string }) => p.universityId && !['cuni','cvut','vut-brno','muni','czu','upol','osu','utb','ujep','uwb'].includes(p.universityId))
    const newProgs = programs.filter((p: import('./countries/czech').Program) => !existingProgramIds.has(p.id))
    existing.programs.push(...newProgs)
    existing.meta.lastUpdated = new Date().toISOString()
    fs.writeFileSync(programsPath, JSON.stringify(existing, null, 2), 'utf-8')
    console.log(`[SCRAPER] Czech Republic — merged ${newProgs.length} new programs into data/programs.json`)
  } catch (err) {
    console.warn('[SCRAPER] Could not merge into programs.json:', err instanceof Error ? err.message : String(err))
  }

  return results
}

async function scrapeAustria(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Austria — not yet implemented')
  // TODO: Implement scraping for Austrian universities:
  //   - univie.ac.at (University of Vienna)
  //   - tuwien.ac.at (TU Wien)
  //   - tugraz.at (TU Graz)
  //   - jku.at (JKU Linz)
  //   - uibk.ac.at (University of Innsbruck)
  //   - plus.ac.at (University of Salzburg)
  //   - wu.ac.at (Vienna University of Economics)
  //   - meduniwien.ac.at (Medical University of Vienna)
  const results: ScrapeResult[] = []
  for (const uni of universities.filter(u => u.country === 'Austria')) {
    results.push({ universityId: uni.id, success: true, programCount: 0, skipped: true })
  }
  return results
}

async function scrapePoland(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Poland — not yet implemented')
  // TODO: Implement scraping for Polish universities:
  //   - uw.edu.pl (University of Warsaw)
  //   - pw.edu.pl (Warsaw University of Technology)
  //   - uj.edu.pl (Jagiellonian University)
  //   - agh.edu.pl (AGH University of Science and Technology)
  //   - put.poznan.pl (Poznań University of Technology)
  //   - amu.edu.pl (Adam Mickiewicz University)
  //   - uw.edu.pl (University of Wrocław)
  //   - pwr.edu.pl (Wrocław University of Science and Technology)
  //   - ug.edu.pl (University of Gdańsk)
  //   - pg.edu.pl (Gdańsk University of Technology)
  const results: ScrapeResult[] = []
  for (const uni of universities.filter(u => u.country === 'Poland')) {
    results.push({ universityId: uni.id, success: true, programCount: 0, skipped: true })
  }
  return results
}

async function scrapeHungary(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Hungary — not yet implemented')
  // TODO: Implement scraping for Hungarian universities:
  //   - elte.hu (Eötvös Loránd University)
  //   - bme.hu (Budapest University of Technology)
  //   - inf.elte.hu (ELTE Faculty of Informatics)
  //   - semmelweis.hu (Semmelweis University)
  //   - uni-miskolc.hu (University of Miskolc)
  //   - pte.hu (University of Pécs)
  //   - u-szeged.hu (University of Szeged)
  //   - unideb.hu (University of Debrecen)
  const results: ScrapeResult[] = []
  for (const uni of universities.filter(u => u.country === 'Hungary')) {
    results.push({ universityId: uni.id, success: true, programCount: 0, skipped: true })
  }
  return results
}

async function scrapeGermany(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Germany — not yet implemented')
  // TODO: Implement scraping for German universities:
  //   - tum.de (Technical University of Munich)
  //   - wsi.tum.de (TUM School of Management)
  //   - tu-berlin.de (TU Berlin)
  //   - rwth-aachen.de (RWTH Aachen)
  //   - kit.edu (Karlsruhe Institute of Technology)
  //   - ph.tum.de (TUM Department of Physics)
  //   - fu-berlin.de (Freie Universität Berlin)
  //   - hu-berlin.de (Humboldt University of Berlin)
  //   - lmu.de (Ludwig Maximilian University of Munich)
  //   - uni-heidelberg.de (Heidelberg University)
  const results: ScrapeResult[] = []
  for (const uni of universities.filter(u => u.country === 'Germany')) {
    results.push({ universityId: uni.id, success: true, programCount: 0, skipped: true })
  }
  return results
}

async function scrapeNetherlands(): Promise<ScrapeResult[]> {
  console.log('[SCRAPER] Netherlands — not yet implemented')
  // TODO: Implement scraping for Dutch universities:
  //   - uva.nl (University of Amsterdam)
  //   - tue.nl (Eindhoven University of Technology)
  //   - tudelft.nl (Delft University of Technology)
  //   - universiteitleiden.nl (Leiden University)
  //   - utwente.nl (University of Twente)
  //   - rug.nl (University of Groningen)
  //   - vu.nl (Vrije Universiteit Amsterdam)
  //   - ru.nl (Radboud University)
  const results: ScrapeResult[] = []
  for (const uni of universities.filter(u => u.country === 'Netherlands')) {
    results.push({ universityId: uni.id, success: true, programCount: 0, skipped: true })
  }
  return results
}

// ============ Individual University Scrape ============

async function processUniversity(
  universityId: string,
  url: string,
  force: boolean
): Promise<ScrapeResult> {
  if (!force && !shouldRescrape(universityId, 7)) {
    const lastScrape = getLastScrapeTime(universityId)
    const existingPrograms = loadScrapedData(universityId)
    console.log(`[SKIP] ${universityId} — data is fresh (last scraped: ${lastScrape?.toISOString() ?? 'never'}, ${existingPrograms.length} programs)`)
    return { universityId, success: true, programCount: existingPrograms.length, skipped: true }
  }

  console.log(`[SCRAPE] ${universityId} — scraping from ${url}`)
  const result = await scrapeAndSave(universityId, url)

  if (result.success) {
    console.log(`[OK] ${universityId} — scraped ${result.programCount} programs`)
  } else {
    console.error(`[FAIL] ${universityId} — ${result.error}`)
  }

  return { universityId, success: result.success, programCount: result.programCount, skipped: false, error: result.error }
}

// ============ Main ETL Runner ============

async function runETL(force: boolean = false): Promise<void> {
  console.log('='.repeat(60))
  console.log('EuroUni ETL Pipeline')
  console.log(`Force mode: ${force}`)
  console.log('='.repeat(60))
  console.log()

  // Country scraper mode: if --country=<name> is passed, run only that scraper
  const countryArg = process.argv.find(a => a.startsWith('--country='))
  if (countryArg) {
    const country = countryArg.split('=')[1]
    console.log(`Running country-specific scraper: ${country}\n`)
    const scrapers: Record<string, () => Promise<ScrapeResult[]>> = {
      slovakia: scrapeSlovakia,
      czech: scrapeCzech,
      austria: scrapeAustria,
      poland: scrapePoland,
      hungary: scrapeHungary,
      germany: scrapeGermany,
      netherlands: scrapeNetherlands,
    }
    const scraper = scrapers[country.toLowerCase()]
    if (!scraper) {
      console.error(`Unknown country: ${country}. Available: ${Object.keys(scrapers).join(', ')}`)
      process.exit(1)
    }
    const results = await scraper()
    console.log(`\n${country} scraper complete: ${results.length} universities`)
    return
  }

  // Default: run individual university scraping (legacy mode)
  const startTime = Date.now()
  const results: ScrapeResult[] = []

  const universitiesToScrape = universities.filter(uni => UNIVERSITY_PROGRAM_URLS[uni.id])
  console.log(`Found ${universitiesToScrape.length} universities with URLs to scrape`)
  console.log()

  const CONCURRENCY = 2
  for (let i = 0; i < universitiesToScrape.length; i += CONCURRENCY) {
    const batch = universitiesToScrape.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(
      batch.map(uni =>
        processUniversity(uni.id, UNIVERSITY_PROGRAM_URLS[uni.id], force).catch(
          (error): ScrapeResult => ({
            universityId: uni.id,
            success: false,
            programCount: 0,
            skipped: false,
            error: error instanceof Error ? error.message : String(error),
          })
        )
      )
    )
    results.push(...batchResults)
  }

  // Reload the data source after scraping completes
  reload()

  // Summary
  const successCount = results.filter(r => r.success && !r.skipped).length
  const skipCount = results.filter(r => r.skipped).length
  const failCount = results.filter(r => !r.success && !r.skipped).length
  const totalPrograms = results.reduce((sum, r) => sum + r.programCount, 0)
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log()
  console.log('='.repeat(60))
  console.log('ETL Summary')
  console.log('='.repeat(60))
  console.log(`Duration: ${duration}s`)
  console.log(`Total universities: ${results.length}`)
  console.log(`  - Scraped: ${successCount}`)
  console.log(`  - Skipped (fresh): ${skipCount}`)
  console.log(`  - Failed: ${failCount}`)
  console.log(`Total programs scraped: ${totalPrograms}`)
  console.log()

  if (failCount > 0) {
    console.log('Failed universities:')
    results.filter(r => !r.success && !r.skipped).forEach(r => {
      console.log(`  - ${r.universityId}: ${r.error}`)
    })
    console.log()
  }

  if (failCount > 0) process.exit(1)
}

function main(): void {
  const force = process.argv.includes('--force')
  runETL(force).catch(error => {
    console.error('ETL pipeline failed:', error)
    process.exit(1)
  })
}

main()
