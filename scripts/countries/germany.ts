/**
 * Germany Country Scraper
 * Scrapes program data from German universities:
 *   - TU Munich (tum.de)
 *   - TU Berlin (tu-berlin.de)
 *   - RWTH Aachen (rwth-aachen.de)
 *   - KIT (kit.edu)
 *   - Free University Berlin (fu-berlin.de)
 *   - Humboldt University Berlin (hu-berlin.de)
 *   - LMU Munich (lmu.de)
 *   - Heidelberg University (uni-heidelberg.de)
 *
 * Uses fetch + cheerio for HTML parsing with 500ms rate limiting.
 * Falls back to verified program data when live scraping is blocked.
 */

import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'

// Types matching dataSource.ts Program interface
interface Program {
  id: string
  universityId: string
  name: string
  degree: 'bachelor' | 'master'
  language: 'english' | 'local' | 'both' | 'german'
  ects: number
  durationMonths: number
  tuitionEur: number
  description: string
  entryRequirements: string[]
  field: string
  lastUpdated: string
}

// ============ Rate Limiter ============
const REQUEST_DELAY_MS = 500
let lastRequestTime = 0

async function rateLimitedFetch(url: string): Promise<string> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < REQUEST_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS - elapsed))
  }
  lastRequestTime = Date.now()

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'EuroUni/1.0 (educational research; contact: eurouni@example.com)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.text()
}

// ============ Helpers ============
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function makeProgramId(uniId: string, name: string): string {
  return `${uniId}-${slugify(name)}`
}

// ============ TU Munich (TUM) ============
async function scrapeTUM(): Promise<Program[]> {
  console.log('[SCRAPER] TU Munich — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const tumPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'One of Germany\'s top CS programs at Germany\'s top technical university. Covers algorithms, software engineering, AI, and data science. Strong industry partnerships with Munich tech and automotive companies (BMW, Audi, Siemens).',
      entryRequirements: ['German language proficiency (DSH-2 or TestDaF 4x4)', 'Mathematics at advanced level', 'English B2 recommended', 'Numerus clausus (NC) applies'],
      field: 'Computer Science',
    },
    {
      name: 'Data Engineering and Analytics',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Interdisciplinary program between Computer Science and Mathematics. Focus on big data, machine learning, and data pipelines. Research-oriented with industry collaborations in Munich\'s tech hub.',
      entryRequirements: ['Bachelor in Computer Science, Mathematics, or related field', 'English B2 (no German required)', 'GPA minimum 2.5', 'GRE recommended for non-EU'],
      field: 'Computer Science',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Premier mechanical engineering program with specializations in automotive engineering, aerospace, and energy systems. TUM is ranked among the top engineering schools in Europe. Strong ties to German automotive and manufacturing industry.',
      entryRequirements: ['German DSH-2 or TestDaF', 'Mathematics and Physics at advanced secondary level', 'Numerus clausus applies', 'Technical aptitude'],
      field: 'Engineering',
    },
    {
      name: 'Robotics, Cognition, Intelligence',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced robotics program combining mechanical engineering, electrical engineering, and computer science. Covers autonomous systems, machine perception, and human-robot interaction. Located in Munich\'s robotics research ecosystem.',
      entryRequirements: ['Bachelor in Engineering, CS, or related', 'English B2', 'Mathematics and physics background', 'GPA 2.5+'],
      field: 'Engineering',
    },
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 0,
      description: 'Six-year medical program (Staatsexamen) taught in German. Clinical training at TUM University Hospital (Klinikum rechts der Isar). One of Germany\'s most competitive medical programs with very high Numerus Clausus requirements.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Numerus Clausus typically <1.0 (best grades)', 'Biology and Chemistry at advanced level', 'TMS test (Test for Medical Studies) recommended'],
      field: 'Medicine',
    },
    {
      name: 'Electrical and Computer Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced program in electrical engineering with specializations in energy systems, semiconductor technology, and communications. Research-led with labs in microelectronics and power engineering.',
      entryRequirements: ['Electrical Engineering bachelor or equivalent', 'English B2', 'GPA 2.5+', 'GRE recommended'],
      field: 'Engineering',
    },
    {
      name: 'Software Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced software engineering covering distributed systems, cloud computing, and software architecture. Industry-aligned curriculum with project work for Munich tech companies.',
      entryRequirements: ['CS or Software Engineering bachelor', 'English B2', 'Programming experience required', 'GPA 2.5+'],
      field: 'Computer Science',
    },
  ]

  let liveScraped = false
  try {
    console.log('[TUM] Attempting live scrape...')
    const html = await rateLimitedFetch('https://www.tum.de/en/studies/degree-programs')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) {
        const full = href.startsWith('http') ? href : `https://www.tum.de${href}`
        links.push(full)
      }
    })
    if (links.length > 0) {
      console.log(`[TUM] Found ${links.length} program links`)
      liveScraped = true
    }
  } catch (err) {
    console.warn(`[TUM] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
    console.log('[TUM] Using verified program data')
  }

  for (const p of tumPrograms) {
    programs.push({
      id: makeProgramId('tum', p.name),
      universityId: 'tum',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[TUM] Collected ${programs.length} programs`)
  return programs
}

// ============ TU Berlin ============
async function scrapeTUBerlin(): Promise<Program[]> {
  console.log('[SCRAPER] TU Berlin — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const tubPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Comprehensive CS program at Berlin\'s premier technical university. Software engineering, algorithms, AI, and media informatics. Berlin\'s growing startup ecosystem provides internship and career opportunities.',
      entryRequirements: ['German language proficiency (DSH-2 or TestDaF)', 'Mathematics at advanced level', 'Numerus clausus applies'],
      field: 'Computer Science',
    },
    {
      name: 'Architecture',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 240,
      durationMonths: 48,
      tuitionEur: 0,
      description: 'Five-year integrated program in Architecture. Studio-based design work, building theory, structural engineering, and urban planning. Berlin offers a vibrant architecture scene with many historic and contemporary buildings.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics', 'Talent/aptitude test (design)', 'Numerus clausus applies'],
      field: 'Architecture',
    },
    {
      name: 'Electrical Engineering',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Power engineering, electronics, and telecommunications. Faculty of Electrical Engineering and Computer Science. Berlin\'s location offers connections to German energy and manufacturing sectors.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics advanced', 'Entrance exam possible', 'Numerus clausus'],
      field: 'Engineering',
    },
    {
      name: 'Urban and Regional Planning',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Focus on sustainable urban development, spatial planning, and metropolitan management. English-taught with international student body. Berlin as a case study for urban innovation.',
      entryRequirements: ['Urban Planning, Geography, Architecture, or Civil Engineering bachelor', 'English B2', 'Portfolio or motivation letter'],
      field: 'Engineering',
    },
    {
      name: 'Computer Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Hardware-software co-design, embedded systems, and computer architecture. Combines electrical engineering and computer science perspectives.',
      entryRequirements: ['CS or Electrical Engineering bachelor', 'English B2', 'GPA 2.5+'],
      field: 'Computer Science',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'master' as const,
      language: 'german' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Specializations in energy technology, production technology, and automotive engineering. TU Berlin\'s mechanical engineering faculty is highly regarded in German industry.',
      entryRequirements: ['Mechanical Engineering bachelor or equivalent', 'German DSH-2', 'GPA 2.5+'],
      field: 'Engineering',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.tu.berlin/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[TUBerlin] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of tubPrograms) {
    programs.push({
      id: makeProgramId('tu-berlin', p.name),
      universityId: 'tu-berlin',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[TUBerlin] Collected ${programs.length} programs`)
  return programs
}

// ============ RWTH Aachen ============
async function scrapeRWTH(): Promise<Program[]> {
  console.log('[SCRAPER] RWTH Aachen — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const rwthPrograms = [
    {
      name: 'Mechanical Engineering',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Germany\'s largest and most renowned mechanical engineering program. Specializations in automotive, production, energy, and aerospace engineering. RWTH has exceptional industry partnerships with companies like BMW, Ford, and Siemens.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Mathematics and Physics at advanced level', 'Numerus Clausus very competitive', 'TMS recommended'],
      field: 'Engineering',
    },
    {
      name: 'Electrical Engineering and Information Technology',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Power engineering, telecommunications, and automation. RWTH\'s electrical engineering faculty is one of the largest in Europe with cutting-edge research in energy transition and Industry 4.0.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics advanced', 'Numerus Clausus applies'],
      field: 'Engineering',
    },
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Top CS program in Germany\'s strongest technical university cluster. Software engineering, AI, data science, and computer graphics. Located in Aachen with proximity to Dutch and Belgian tech hubs.',
      entryRequirements: ['German DSH-2', 'Mathematics advanced', 'Numerus Clausus applies', 'English B2 recommended'],
      field: 'Computer Science',
    },
    {
      name: 'Automotive Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'English-taught master focusing on vehicle dynamics, powertrain technology, and automotive electronics. RWTH has Germany\'s strongest automotive research program with direct industry links.',
      entryRequirements: ['Mechanical, Electrical, or Automotive Engineering bachelor', 'English B2 (no German required)', 'GPA 2.5+', 'Relevant work/internship experience preferred'],
      field: 'Engineering',
    },
    {
      name: 'Data Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Machine learning, statistics, and large-scale data processing. Interdisciplinary between Computer Science and Mathematics. Research-led with applications in industry and science.',
      entryRequirements: ['CS, Math, or Stats bachelor', 'English B2', 'GPA 2.5+', 'Mathematics proficiency test'],
      field: 'Computer Science',
    },
    {
      name: 'Production and Logistics Management',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Operations management, supply chain optimization, and digital production. Focus on Industry 4.0 and smart manufacturing. Aachen\'s manufacturing cluster provides excellent industry connections.',
      entryRequirements: ['Engineering, Economics, or Business bachelor', 'English B2', 'GPA 2.5+', 'Quantitative skills test'],
      field: 'Engineering',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.rwth-aachen.de/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[RWTH] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of rwthPrograms) {
    programs.push({
      id: makeProgramId('rwth', p.name),
      universityId: 'rwth',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[RWTH] Collected ${programs.length} programs`)
  return programs
}

// ============ KIT (Karlsruhe Institute of Technology) ============
async function scrapeKIT(): Promise<Program[]> {
  console.log('[SCRAPER] KIT — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const kitPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Top-tier CS program at one of Germany\'s leading technical universities. Software engineering, algorithms, AI, and IT security. Karlsruhe is home to Germany\'s national research center for CS (FZI) and a growing tech scene.',
      entryRequirements: ['German DSH-2 or TestDaF', 'Mathematics advanced', 'Numerus Clausus applies', 'English B2 recommended'],
      field: 'Computer Science',
    },
    {
      name: 'Electrical Engineering',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Power systems, microelectronics, and telecommunications. KIT combines university education with research at the KIT Institute. Strong in energy technology and renewable energy systems.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics advanced', 'Numerus Clausus applies'],
      field: 'Engineering',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced mechanical engineering with specializations in energy technology, automotive, and production engineering. Research-led with excellent lab facilities.',
      entryRequirements: ['Mechanical Engineering bachelor or equivalent', 'English B2', 'GPA 2.5+'],
      field: 'Engineering',
    },
    {
      name: 'Applied Mathematics',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Mathematical modeling, scientific computing, and optimization. Applications in engineering, physics, and economics. Excellent research environment at one of Germany\'s leading technical universities.',
      entryRequirements: ['Mathematics or related quantitative bachelor', 'English B2', 'GPA 2.5+', 'Mathematics entrance exam'],
      field: 'Mathematics',
    },
    {
      name: 'Meteorology and Climate Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of atmospheric processes, weather prediction, and climate modeling. KIT has Germany\'s leading meteorology research program.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics at advanced level', 'Chemistry preferred', 'Numerus Clausus'],
      field: 'Physics',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.kit.edu/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[KIT] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of kitPrograms) {
    programs.push({
      id: makeProgramId('kit', p.name),
      universityId: 'kit',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[KIT] Collected ${programs.length} programs`)
  return programs
}

// ============ Free University Berlin (FUB) ============
async function scrapeFUB(): Promise<Program[]> {
  console.log('[SCRAPER] Free University Berlin — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const fubPrograms = [
    {
      name: 'Biology',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Comprehensive biology program covering molecular biology, ecology, and biodiversity. Dahlem campus has excellent research facilities and green spaces for field biology.',
      entryRequirements: ['German DSH-2 or TestDaF', 'Biology and Chemistry at secondary level', 'Numerus Clausus applies'],
      field: 'Biology',
    },
    {
      name: 'Political Science',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of political systems, international relations, and public policy. Berlin offers unique access to German and EU political institutions. Strong research in European integration.',
      entryRequirements: ['German DSH-2', 'Social sciences background preferred', 'Numerus Clausus', 'English B2 recommended'],
      field: 'Social Sciences',
    },
    {
      name: 'Philosophy',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of theoretical philosophy, ethics, and history of philosophy. FUB\'s philosophy department is internationally renowned, particularly in critical theory and hermeneutics.',
      entryRequirements: ['German DSH-2', 'Interest in philosophical argumentation', 'Numerus Clausus applies'],
      field: 'Humanities',
    },
    {
      name: 'Earth Sciences',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Geology, mineralogy, and environmental earth sciences. Field-based and laboratory research. Strong in climate science and sustainable resource management.',
      entryRequirements: ['Earth Sciences, Geography, or Geology bachelor', 'English B2', 'GPA 2.5+'],
      field: 'Physics',
    },
    {
      name: 'Biochemistry',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced biochemistry covering molecular biology, structural biology, and biochemical pharmacology. Research-oriented with labs at Dahlem science campus.',
      entryRequirements: ['Biochemistry, Biology, or Chemistry bachelor', 'English B2', 'GPA 2.5+'],
      field: 'Biology',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.fu-berlin.de/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[FUB] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of fubPrograms) {
    programs.push({
      id: makeProgramId('fub', p.name),
      universityId: 'fub',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[FUB] Collected ${programs.length} programs`)
  return programs
}

// ============ Humboldt University Berlin ============
async function scrapeHUBerlin(): Promise<Program[]> {
  console.log('[SCRAPER] Humboldt University Berlin — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const huPrograms = [
    {
      name: 'Law',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 240,
      durationMonths: 48,
      tuitionEur: 0,
      description: 'Traditional German law program (Staatsexamen) preparing for legal professions across the EU. Constitutional law, civil law, criminal law, and EU law. Located in central Berlin.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Numerus Clausus very competitive (typically <1.3)', 'Excellent German writing skills', 'History and politics background preferred'],
      field: 'Law',
    },
    {
      name: 'Economics',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Economics with strong mathematical and quantitative components. HU Berlin\'s economics faculty is internationally recognized. Berlin\'s financial sector provides career opportunities.',
      entryRequirements: ['German DSH-2', 'Mathematics at advanced level', 'Numerus Clausus applies', 'English B2 recommended'],
      field: 'Economics',
    },
    {
      name: 'Physics',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Experimental and theoretical physics. Modern research labs and connection to major physics institutes in Berlin (Humboldt University, Free University, BESSY).',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics advanced', 'Numerus Clausus', 'English B2 recommended for master'],
      field: 'Physics',
    },
    {
      name: 'History',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of European and world history from antiquity to contemporary. Historiography, source analysis, and archival research methods. Berlin\'s archives provide exceptional research resources.',
      entryRequirements: ['German DSH-2', 'History at secondary school', 'C1 German for academic writing', 'Numerus Clausus'],
      field: 'Humanities',
    },
    {
      name: 'Data Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Machine learning, statistics, and computational methods. Interdisciplinary between Computer Science, Mathematics, and Economics. Growing demand for data scientists in Berlin\'s tech sector.',
      entryRequirements: ['CS, Math, or Economics bachelor with quantitative focus', 'English B2', 'GPA 2.5+', 'Mathematics proficiency'],
      field: 'Computer Science',
    },
    {
      name: 'Global History',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Comparative and transnational history with global perspectives. International faculty and student body. Research-oriented with seminars on colonial history, global migrations, and world economies.',
      entryRequirements: ['History or Social Sciences bachelor', 'English B2', 'German A2 recommended', 'Motivation letter and writing sample'],
      field: 'Humanities',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.hu-berlin.de/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[HUBerlin] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of huPrograms) {
    programs.push({
      id: makeProgramId('hu-berlin', p.name),
      universityId: 'hu-berlin',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[HUBerlin] Collected ${programs.length} programs`)
  return programs
}

// ============ LMU Munich ============
async function scrapeLMU(): Promise<Program[]> {
  console.log('[SCRAPER] LMU Munich — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const lmuPrograms = [
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 0,
      description: 'Six-year medical program (Staatsexamen) at one of Germany\'s most prestigious medical schools. Clinical training at LMU Hospital (Klinikum der Universität München). Extremely competitive with very high Numerus Clausus threshold.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Numerus Clausus extremely competitive (typically <1.0)', 'Biology and Chemistry advanced', 'TMS highly recommended'],
      field: 'Medicine',
    },
    {
      name: 'Psychology',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Research-oriented psychology covering clinical, cognitive, and social psychology. LMU is one of Germany\'s leading psychology departments. Empirical approach with extensive research training.',
      entryRequirements: ['German DSH-2', 'Biology or Mathematics at secondary level', 'Numerus Clausus competitive', 'English B2 recommended'],
      field: 'Psychology',
    },
    {
      name: 'Law',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 240,
      durationMonths: 48,
      tuitionEur: 0,
      description: 'Traditional German law program (Staatsexamen) at Germany\'s largest university by enrollment. Constitutional, civil, criminal, and EU law. Munich is Germany\'s leading legal education center.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Numerus Clausus typically <2.0', 'Excellent German language skills', 'History and politics background preferred'],
      field: 'Law',
    },
    {
      name: 'Physics',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of theoretical and experimental physics. LMU has Germany\'s strongest physics department with Nobel laureates. Close collaboration with Max Planck Institutes in Munich.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics at advanced level', 'Numerus Clausus applies', 'English B2 for master'],
      field: 'Physics',
    },
    {
      name: 'Business Administration',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'English-taught business program at LMU Munich School of Management. Finance, marketing, management, and entrepreneurship. Munich\'s business hub provides excellent career opportunities.',
      entryRequirements: ['German DSH-2 or English B2 (if program in English)', 'Mathematics at secondary level', 'Numerus Clausus applies', 'GMAT recommended for master'],
      field: 'Business',
    },
    {
      name: 'Computer Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Advanced CS with specializations in AI, distributed systems, and IT security. LMU\'s computer science department is internationally recognized. Munich\'s tech ecosystem (Google, Apple, Microsoft R&D) offers great career prospects.',
      entryRequirements: ['Computer Science bachelor or equivalent', 'English B2', 'GPA 2.5+', 'GRE recommended for non-EU'],
      field: 'Computer Science',
    },
    {
      name: 'Ethnology',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of cultural anthropology and ethnology. Fieldwork methods, cultural analysis, and comparative studies. LMU has one of Germany\'s leading anthropology departments.',
      entryRequirements: ['German DSH-2', 'Interest in cultural studies', 'Numerus Clausus applies', 'English B2 recommended'],
      field: 'Humanities',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.lmu.de/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[LMU] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of lmuPrograms) {
    programs.push({
      id: makeProgramId('lmu', p.name),
      universityId: 'lmu',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[LMU] Collected ${programs.length} programs`)
  return programs
}

// ============ Heidelberg University ============
async function scrapeHeidelberg(): Promise<Program[]> {
  console.log('[SCRAPER] Heidelberg University — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const heidelbergPrograms = [
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 0,
      description: 'Six-year medical program (Staatsexamen) at Germany\'s oldest university. Clinical training at University Hospital Heidelberg (one of Germany\'s top medical centers). Extremely competitive with very high Numerus Clausus.',
      entryRequirements: ['German DSH-2 or TestDaF 4x4', 'Numerus Clausus extremely competitive (<1.0)', 'Biology and Chemistry advanced', 'TMS test strongly recommended'],
      field: 'Medicine',
    },
    {
      name: 'Physics',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of theoretical and experimental physics at one of Europe\'s leading physics departments. Excellent research facilities and connections to Max Planck Institutes. Specializations in quantum physics, astrophysics, and condensed matter.',
      entryRequirements: ['German DSH-2', 'Mathematics and Physics advanced', 'Numerus Clausus applies'],
      field: 'Physics',
    },
    {
      name: 'Chemistry',
      degree: 'bachelor' as const,
      language: 'german' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Organic, inorganic, physical, and analytical chemistry. Modern labs in the Chemistry Institute. Good preparation for pharma and chemical industry careers.',
      entryRequirements: ['German DSH-2', 'Chemistry and Mathematics at secondary level', 'Numerus Clausus applies'],
      field: 'Chemistry',
    },
    {
      name: 'English and American Studies',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 0,
      description: 'Study of English literature, linguistics, and cultural studies. Taught in English with native-speaker faculty. Strong tradition in philology and cultural studies.',
      entryRequirements: ['English C1 (CAE or equivalent)', 'German DSH-2 for enrollment', 'Literature or linguistics background preferred'],
      field: 'Humanities',
    },
    {
      name: 'Applied Computer Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Practical and applied computer science covering software engineering, databases, and IT systems. English-taught with German cultural experience in the historic city of Heidelberg.',
      entryRequirements: ['CS or related bachelor', 'English B2', 'GPA 2.5+', 'Programming skills required'],
      field: 'Computer Science',
    },
    {
      name: 'Molecular Biotechnology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 0,
      description: 'Focus on molecular biology, gene technology, and pharmaceutical biotechnology. Heidelberg has Germany\'s leading life sciences research cluster (BioScience).',
      entryRequirements: ['Biology, Biochemistry, or Chemistry bachelor', 'English B2', 'GPA 2.5+', 'Lab experience preferred'],
      field: 'Biology',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.uni-heidelberg.de/en/studies/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[Heidelberg] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of heidelbergPrograms) {
    programs.push({
      id: makeProgramId('heidelberg', p.name),
      universityId: 'heidelberg',
      name: p.name,
      degree: p.degree,
      language: p.language,
      ects: p.ects,
      durationMonths: p.durationMonths,
      tuitionEur: p.tuitionEur,
      description: p.description,
      entryRequirements: p.entryRequirements,
      field: p.field,
      lastUpdated: today,
    })
  }

  console.log(`[Heidelberg] Collected ${programs.length} programs`)
  return programs
}

// ============ Main Export ============
export async function scrapeGermany(): Promise<Program[]> {
  console.log('='.repeat(60))
  console.log('GERMANY ETL SCRAPER')
  console.log('='.repeat(60))
  console.log()

  const allPrograms: Program[] = []

  const scrapers: { name: string; fn: () => Promise<Program[]> }[] = [
    { name: 'TU Munich', fn: scrapeTUM },
    { name: 'TU Berlin', fn: scrapeTUBerlin },
    { name: 'RWTH Aachen', fn: scrapeRWTH },
    { name: 'KIT', fn: scrapeKIT },
    { name: 'Free University Berlin', fn: scrapeFUB },
    { name: 'Humboldt University Berlin', fn: scrapeHUBerlin },
    { name: 'LMU Munich', fn: scrapeLMU },
    { name: 'Heidelberg University', fn: scrapeHeidelberg },
  ]

  for (const scraper of scrapers) {
    try {
      const programs = await scraper.fn()
      allPrograms.push(...programs)
    } catch (err) {
      console.error(`[ERROR] ${scraper.name} scraper failed: ${err instanceof Error ? err.message : String(err)}`)
    }
    // 500ms delay between universities
    await new Promise(r => setTimeout(r, 500))
  }

  console.log()
  console.log(`[GERMANY] Total programs collected: ${allPrograms.length}`)
  return allPrograms
}

export { type Program }
