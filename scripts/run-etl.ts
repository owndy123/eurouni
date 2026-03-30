/**
 * ETL Runner Script
 * Run: npx ts-node scripts/run-etl.ts
 * Run with force: npx ts-node scripts/run-etl.ts --force
 */

import { scrapeAndSave, shouldRescrape, loadScrapedData, getLastScrapeTime } from '../src/lib/etl-pipeline'
import { universities } from '../src/data/mockData'

// University program URLs - map university IDs to their program listing URLs
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

async function processUniversity(
  universityId: string,
  url: string,
  force: boolean
): Promise<ScrapeResult> {
  // Check if we should skip based on data age
  if (!force && !shouldRescrape(universityId, 7)) {
    const lastScrape = getLastScrapeTime(universityId)
    const existingPrograms = loadScrapedData(universityId)
    console.log(`[SKIP] ${universityId} - data is fresh (last scraped: ${lastScrape?.toISOString() || 'never'}, ${existingPrograms.length} programs)`)
    return {
      universityId,
      success: true,
      programCount: existingPrograms.length,
      skipped: true,
    }
  }

  // Scrape and save
  console.log(`[SCRAPE] ${universityId} - scraping from ${url}`)
  const result = await scrapeAndSave(universityId, url)

  if (result.success) {
    console.log(`[OK] ${universityId} - scraped ${result.programCount} programs`)
  } else {
    console.error(`[FAIL] ${universityId} - ${result.error}`)
  }

  return {
    universityId,
    success: result.success,
    programCount: result.programCount,
    skipped: false,
    error: result.error,
  }
}

async function runETL(force: boolean = false): Promise<void> {
  console.log('='.repeat(60))
  console.log('EuroUni ETL Pipeline')
  console.log(`Force mode: ${force}`)
  console.log('='.repeat(60))
  console.log()

  const startTime = Date.now()
  const results: ScrapeResult[] = []

  // Get universities that have URLs defined
  const universitiesToScrape = universities.filter(
    uni => UNIVERSITY_PROGRAM_URLS[uni.id]
  )

  console.log(`Found ${universitiesToScrape.length} universities with URLs to scrape`)
  console.log()

  // Process in batches of 2 for controlled concurrency
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
    results
      .filter(r => !r.success && !r.skipped)
      .forEach(r => {
        console.log(`  - ${r.universityId}: ${r.error}`)
      })
    console.log()
  }

  // Exit with error code if any failures
  if (failCount > 0) {
    process.exit(1)
  }
}

// Main entry point
function main(): void {
  const force = process.argv.includes('--force')
  runETL(force).catch(error => {
    console.error('ETL pipeline failed:', error)
    process.exit(1)
  })
}

main()
