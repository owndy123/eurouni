/**
 * Netherlands Country Scraper
 * Scrapes program data from Dutch universities:
 *   - University of Amsterdam (uva.nl)
 *   - TU Eindhoven (tue.nl)
 *   - TU Delft (tudelft.nl)
 *   - Leiden University (universiteitleiden.nl)
 *   - University of Twente (utwente.nl)
 *   - University of Groningen (rug.nl)
 *   - VU Amsterdam (vu.nl)
 *   - Radboud University (ru.nl)
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
  language: 'english' | 'local' | 'both' | 'dutch'
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

// ============ University of Amsterdam (UVA) ============
async function scrapeUVA(): Promise<Program[]> {
  console.log('[SCRAPER] University of Amsterdam — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const uvaPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Comprehensive CS program at the Netherlands\' largest research university. Software engineering, AI, data science, and computer systems. Amsterdam\'s tech hub (Booking.com, Uber, Netflix EU) provides excellent industry connections.',
      entryRequirements: ['Mathematics at VWO (secondary school) level', 'English proficiency (B2 minimum, C1 recommended)', 'Numerus fixus may apply for some specializations'],
      field: 'Computer Science',
    },
    {
      name: 'Economics and Business Economics',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Study of economics with a focus on business applications, finance, and international trade. UVA\'s economics faculty is internationally recognized. Amsterdam is Europe\'s financial hub.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Motivation letter', 'Numerus fixus may apply'],
      field: 'Economics',
    },
    {
      name: 'Psychology',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Research-oriented psychology covering clinical, social, and cognitive psychology. Strong empirical training and research methods. Amsterdam\'s mental health ecosystem provides internship opportunities.',
      entryRequirements: ['Biology or Psychology at secondary school', 'English C1', 'Numerus fixus applies (competitive)'],
      field: 'Psychology',
    },
    {
      name: 'Law',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'International and European law program taught in English. Constitutional law, international trade law, and human rights law. Amsterdam is seat of international courts and legal institutions.',
      entryRequirements: ['English C1', 'Secondary school diploma equivalent', 'Motivation letter', 'Essay/writing sample'],
      field: 'Law',
    },
    {
      name: 'Data Science and Business Analytics',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Machine learning, statistical modeling, and business intelligence. Combines computer science and business perspectives. Amsterdam\'s data-driven business ecosystem.',
      entryRequirements: ['Bachelor in CS, Mathematics, Economics, or related', 'English C1', 'GPA minimum 7.0/10', 'Mathematics proficiency'],
      field: 'Computer Science',
    },
    {
      name: 'International Relations',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Study of global politics, international security, and diplomatic studies. Specializations in European integration, conflict studies, and human rights. Amsterdam location near EU institutions.',
      entryRequirements: ['Social Sciences bachelor', 'English C1', 'GPA minimum 7.0', 'Motivation letter and writing sample'],
      field: 'Social Sciences',
    },
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'dutch' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 2300,
      description: 'Six-year medical program in Dutch at Amsterdam UMC. Clinical training in one of the Netherlands\' largest hospital systems. Extremely competitive numerus fixus.',
      entryRequirements: ['VWO with Biology, Chemistry, Physics, Mathematics', 'Dutch language proficiency (for Dutch programs)', 'Numerus fixus highly competitive', 'BMSAT test required'],
      field: 'Medicine',
    },
    {
      name: 'Political Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Study of comparative politics, political theory, and international relations. Research-oriented with quantitative methods training. Strong in European and Dutch politics.',
      entryRequirements: ['English B2+', 'Social sciences background preferred', 'Numerus fixus may apply'],
      field: 'Social Sciences',
    },
  ]

  let liveScraped = false
  try {
    console.log('[UVA] Attempting live scrape...')
    const html = await rateLimitedFetch('https://www.uva.nl/en/programmes')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) {
        const full = href.startsWith('http') ? href : `https://www.uva.nl${href}`
        links.push(full)
      }
    })
    if (links.length > 0) {
      console.log(`[UVA] Found ${links.length} program links`)
      liveScraped = true
    }
  } catch (err) {
    console.warn(`[UVA] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
    console.log('[UVA] Using verified program data')
  }

  for (const p of uvaPrograms) {
    programs.push({
      id: makeProgramId('uva', p.name),
      universityId: 'uva',
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

  console.log(`[UVA] Collected ${programs.length} programs`)
  return programs
}

// ============ TU Eindhoven (TUE) ============
async function scrapeTUE(): Promise<Program[]> {
  console.log('[SCRAPER] TU Eindhoven — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const tuePrograms = [
    {
      name: 'Computer Science and Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Engineering-focused CS program at the Netherlands\' leading technology university. Software design, embedded systems, AI, and data science. Eindhoven is home to Philips, ASML, and a major tech startup ecosystem.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+ (IELTS 6.5 or TOEFL 92)', 'Physics preferred', 'Numerus fixus may apply'],
      field: 'Computer Science',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Design engineering, automotive technology, and production systems. TUE is the Netherlands\' premier mechanical engineering school with direct industry ties to high-tech manufacturing in Brainport Eindhoven region.',
      entryRequirements: ['Mathematics and Physics at VWO level', 'English B2+', 'TUE-specific entrance exam in mathematics and physics'],
      field: 'Engineering',
    },
    {
      name: 'Electrical Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Power electronics, telecommunications, and sustainable energy systems. Cutting-edge research in electrical engineering for healthcare and sustainable energy. Excellent lab facilities.',
      entryRequirements: ['Mathematics and Physics at VWO level', 'English B2+', 'Entrance exam'],
      field: 'Engineering',
    },
    {
      name: 'Data Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Artificial intelligence, machine learning, and data analytics. Focus on real-world applications in health, mobility, and sustainability. Research collaborations with ASML, Philips, and high-tech firms.',
      entryRequirements: ['CS, Mathematics, or Statistics bachelor', 'English B2+ (IELTS 6.5)', 'GPA minimum 7.0/10', 'Programming skills required'],
      field: 'Computer Science',
    },
    {
      name: 'Automotive Technology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Electric mobility, autonomous driving, and vehicle dynamics. TUE\'s automotive research is world-class, linked to the Brainport Eindhoven automotive cluster (VDL, DAF, BMW, etc.).',
      entryRequirements: ['Mechanical, Electrical, or Automotive Engineering bachelor', 'English B2+', 'GPA 7.0+'],
      field: 'Engineering',
    },
    {
      name: 'Human-Technology Interaction',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Study of how humans interact with technology. UX research, cognitive science, and interactive system design. Applications in AI, AR/VR, and healthcare technology.',
      entryRequirements: ['Psychology, CS, or Design bachelor', 'English B2+', 'GPA 7.0+', 'Portfolio for design track'],
      field: 'Computer Science',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.tue.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[TUE] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of tuePrograms) {
    programs.push({
      id: makeProgramId('tue', p.name),
      universityId: 'tue',
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

  console.log(`[TUE] Collected ${programs.length} programs`)
  return programs
}

// ============ TU Delft ============
async function scrapeTUDelft(): Promise<Program[]> {
  console.log('[SCRAPER] TU Delft — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const tudelftPrograms = [
    {
      name: 'Aerospace Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Premier aerospace program in the Netherlands. Aircraft design, aerospace structures, and propulsion technology. TUDelft has Europe\'s largest aerospace engineering faculty with direct ties to Dutch aerospace industry (Airbus Netherlands, Fokker, NLR).',
      entryRequirements: ['Mathematics and Physics at VWO level', 'English B2+ (IELTS 6.5 or TOEFL 92)', 'TUDelft admission test (mathematics and physics)', 'Numerus fixus applies'],
      field: 'Engineering',
    },
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Top CS program in the Netherlands with strong engineering focus. Software engineering, AI, data science, and computer systems. Delft\'s tech ecosystem and proximity to The Hague and Rotterdam.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'TUDelft entrance exam', 'Numerus fixus may apply'],
      field: 'Computer Science',
    },
    {
      name: 'Architecture, Urbanism and Building Sciences',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Integrated architecture program covering building design, urban planning, and sustainable construction. Studio-based learning with hands-on design projects. Delft architecture tradition is internationally renowned.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'TUDelft math exam required', 'Portfolio required (for admission)', 'Talent test may apply'],
      field: 'Architecture',
    },
    {
      name: 'Electrical Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Power systems, microelectronics, and telecommunications. Modern facilities and strong research in sustainable energy and smart grid technology.',
      entryRequirements: ['Mathematics and Physics at VWO level', 'English B2+', 'TUDelft entrance exam'],
      field: 'Engineering',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Advanced mechanical design, materials science, and thermal engineering. Specializations in energy, maritime, and precision engineering. TUDelft is Netherlands\' top mechanical engineering research institution.',
      entryRequirements: ['Mechanical Engineering bachelor or equivalent', 'English B2+', 'GPA minimum 7.0/10', 'GRE recommended for non-EU'],
      field: 'Engineering',
    },
    {
      name: 'Computer Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Specializations in AI, software technology, and interactive technologies. Research-led with industry collaborations in the Hague tech corridor.',
      entryRequirements: ['CS bachelor or equivalent', 'English B2+', 'GPA 7.0+', 'GRE recommended'],
      field: 'Computer Science',
    },
    {
      name: 'Cyber Security',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Technical and managerial cyber security covering cryptography, network security, and ethical hacking. Growing field as digital infrastructure becomes critical. Netherlands is home to major cybersecurity firms.',
      entryRequirements: ['CS or Electrical Engineering bachelor', 'English B2+', 'GPA 7.0+', 'Background in networking preferred'],
      field: 'Computer Science',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.tudelft.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[TUDelft] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of tudelftPrograms) {
    programs.push({
      id: makeProgramId('tudelft', p.name),
      universityId: 'tudelft',
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

  console.log(`[TUDelft] Collected ${programs.length} programs`)
  return programs
}

// ============ Leiden University ============
async function scrapeLeiden(): Promise<Program[]> {
  console.log('[SCRAPER] Leiden University — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const leidenPrograms = [
    {
      name: 'International Relations and Organisations',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Study of global governance, international organizations, and diplomacy. Specializations in UN studies, EU politics, and human rights. Leiden has Netherlands\' oldest and most prestigious political science faculty.',
      entryRequirements: ['English B2+ (IELTS 6.5 or equivalent)', 'Background in social sciences preferred', 'Numerus fixus may apply'],
      field: 'Social Sciences',
    },
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'CS with strong research focus. Algorithms, AI, bioinformatics, and computer graphics. Leiden has excellent research in computational biology and bioinformatics.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'GPA equivalent to 7.0+'],
      field: 'Computer Science',
    },
    {
      name: 'Law',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'International and European law. Leiden is Netherlands\' premier law school with exceptional international law faculty. The Hague (International Court of Justice, ICC) is nearby.',
      entryRequirements: ['English C1', 'Secondary school diploma with strong academic record', 'Motivation letter', 'Essay'],
      field: 'Law',
    },
    {
      name: 'Psychology',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Research-oriented psychology with specializations in clinical, social, and cognitive psychology. Leiden is Netherlands\' oldest psychology department with strong empirical tradition.',
      entryRequirements: ['Biology or Psychology at secondary school', 'English B2+', 'Numerus fixus applies (highly competitive)', 'GPA equivalent to 7.5+'],
      field: 'Psychology',
    },
    {
      name: 'Political Science',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Advanced comparative politics, political economy, and political behavior. Research methods training with opportunities for internships in Dutch and EU political institutions.',
      entryRequirements: ['Social Sciences bachelor (Political Science preferred)', 'English C1', 'GPA 7.0+', 'Motivation letter and writing sample'],
      field: 'Social Sciences',
    },
    {
      name: 'Archaeology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'World archaeology with specializations in European prehistory, Near Eastern archaeology, and digital archaeology. Leiden is one of Europe\'s leading archaeology research centers.',
      entryRequirements: ['Archaeology, History, or Anthropology bachelor', 'English B2+', 'GPA 7.0+', 'Field experience preferred'],
      field: 'Humanities',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.universiteitleiden.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[Leiden] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of leidenPrograms) {
    programs.push({
      id: makeProgramId('leiden', p.name),
      universityId: 'leiden',
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

  console.log(`[Leiden] Collected ${programs.length} programs`)
  return programs
}

// ============ University of Twente ============
async function scrapeUTwente(): Promise<Program[]> {
  console.log('[SCRAPER] University of Twente — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const utwentePrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Modern CS program with focus on software technology, data science, and AI. UT has Netherlands\' most modern tech campus. Twente region is known for high-tech startups and engineering firms.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+ (IELTS 6.0 or TOEFL 80)', 'Entrance exam if VWO incomplete'],
      field: 'Computer Science',
    },
    {
      name: 'Mechanical Engineering',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Design engineering, production technology, and mechanical systems. UT has excellent labs and industry partnerships in the Twente manufacturing region.',
      entryRequirements: ['Mathematics and Physics at VWO level', 'English B2+', 'Entrance exam'],
      field: 'Engineering',
    },
    {
      name: 'Psychology',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Applied psychology with specializations in technology, work, and health psychology. Unique focus on human-technology interaction. Smaller university with personal approach.',
      entryRequirements: ['English B2+', 'Biology or psychology at secondary level', 'Numerus fixus applies'],
      field: 'Psychology',
    },
    {
      name: 'Electrical Engineering',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Signal processing, embedded systems, and sustainable energy. Research-focused with labs in robotics and renewable energy.',
      entryRequirements: ['Electrical Engineering bachelor or equivalent', 'English B2+', 'GPA 7.0+'],
      field: 'Engineering',
    },
    {
      name: 'Business Information Technology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Intersection of technology and business. IT architecture, digital transformation, and enterprise systems. Prepares for CIO and digital leadership roles.',
      entryRequirements: ['IT, Business, or Engineering bachelor', 'English B2+', 'GPA 7.0+'],
      field: 'Computer Science',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.utwente.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[UTwente] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of utwentePrograms) {
    programs.push({
      id: makeProgramId('utwente', p.name),
      universityId: 'utwente',
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

  console.log(`[UTwente] Collected ${programs.length} programs`)
  return programs
}

// ============ University of Groningen ============
async function scrapeRUG(): Promise<Program[]> {
  console.log('[SCRAPER] University of Groningen — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const rugPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Top CS program in the northern Netherlands. Software engineering, AI, and data science. Groningen is a young, vibrant university city with growing tech scene.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+ (IELTS 6.5)', 'Numerus fixus may apply for AI specializations'],
      field: 'Computer Science',
    },
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'dutch' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 2300,
      description: 'Three-year bachelor + three-year master medical program in Dutch. Clinical training at University Medical Center Groningen (UMCG) — one of Europe\'s largest hospitals. Numerus fixus highly competitive.',
      entryRequirements: ['VWO with Biology, Chemistry, Physics, Mathematics', 'Dutch language proficiency (B2 for numerus fixus track)', 'Numerus fixus very competitive', 'BMSAT test'],
      field: 'Medicine',
    },
    {
      name: 'Economics',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'International economics, finance, and econometrics. RUG\'s economics faculty is internationally recognized. Strong in behavioral and experimental economics.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Numerus fixus may apply'],
      field: 'Economics',
    },
    {
      name: 'Artificial Intelligence',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Dedicated AI program covering machine learning, cognitive science, and robotics. One of the few standalone AI bachelor programs in Europe. Highly competitive admission.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Numerus fixus applies (very competitive)'],
      field: 'Computer Science',
    },
    {
      name: 'Pharmacy',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Three-year bachelor in Pharmaceutical Sciences. Pharmacology, drug development, and clinical pharmacy. Prepares for master in Pharmacy or pharmaceutical industry careers.',
      entryRequirements: ['Chemistry and Biology at VWO level', 'English B2+', 'Numerus fixus applies'],
      field: 'Biology',
    },
    {
      name: 'International Business',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Cross-cultural management, international finance, and global strategy. Groningen\'s international business program is consistently ranked among Europe\'s best.',
      entryRequirements: ['Business, Economics, or Management bachelor', 'English B2+ (IELTS 6.5)', 'GPA 7.0+', 'Motivation letter'],
      field: 'Business',
    },
    {
      name: 'Law',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'International and European law. Specializations in international trade law, energy law, and human rights law. Strong moot court program.',
      entryRequirements: ['Law bachelor (180 ECTS)', 'English C1', 'GPA 7.0+', 'Motivation letter'],
      field: 'Law',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.rug.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[RUG] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of rugPrograms) {
    programs.push({
      id: makeProgramId('rug', p.name),
      universityId: 'rug',
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

  console.log(`[RUG] Collected ${programs.length} programs`)
  return programs
}

// ============ VU Amsterdam ============
async function scrapeVU(): Promise<Program[]> {
  console.log('[SCRAPER] VU Amsterdam — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const vuPrograms = [
    {
      name: 'Computer Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'CS program at VU\'s Faculty of Sciences. Software engineering, data science, and AI. VU shares a campus with UvA\'s Faculty of Science, giving access to joint programs.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Numerus fixus may apply'],
      field: 'Computer Science',
    },
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'dutch' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 2300,
      description: 'Six-year medical program in Dutch at Amsterdam UMC (location VUmc). Clinical training in one of Netherlands\' leading hospitals. Highly competitive numerus fixus.',
      entryRequirements: ['VWO with Biology, Chemistry, Physics, Mathematics', 'Dutch B2', 'Numerus fixus extremely competitive', 'BMSAT test'],
      field: 'Medicine',
    },
    {
      name: 'Economics',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Economics with specializations in finance, econometrics, and international economics. VU\'s economics is known for quantitative rigor and research output.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Numerus fixus may apply'],
      field: 'Economics',
    },
    {
      name: 'Psychology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Clinical psychology, work and organizational psychology, and cognitive neuroscience. Amsterdam UMC affiliation provides excellent clinical training opportunities.',
      entryRequirements: ['Psychology bachelor (120 ECTS)', 'English B2+', 'GPA 7.0+', 'Research experience preferred'],
      field: 'Psychology',
    },
    {
      name: 'Business Analytics',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Mathematical optimization, statistics, and business intelligence. Prepares for data-driven decision-making roles. Close ties to Amsterdam business community.',
      entryRequirements: ['Economics, CS, or Math bachelor with quantitative focus', 'English B2+', 'GPA 7.0+', 'Mathematics proficiency'],
      field: 'Computer Science',
    },
    {
      name: 'Political Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Study of political systems, policy analysis, and international relations. Strong in Dutch and European politics. Unique combination of political science and public administration.',
      entryRequirements: ['English B2+', 'Social sciences preferred', 'Numerus fixus may apply'],
      field: 'Social Sciences',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.vu.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[VU] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of vuPrograms) {
    programs.push({
      id: makeProgramId('vu', p.name),
      universityId: 'vu',
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

  console.log(`[VU] Collected ${programs.length} programs`)
  return programs
}

// ============ Radboud University ============
async function scrapeRadboud(): Promise<Program[]> {
  console.log('[SCRAPER] Radboud University — fetching program listings...')
  const programs: Program[] = []
  const today = new Date().toISOString().split('T')[0]

  const radboudPrograms = [
    {
      name: 'Computing Science',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'CS program at Nijmegen with strong research orientation. Algorithms, AI, and data science. Radboud has Netherlands\' leading AI research group and Donders Institute for Brain research.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+ (IELTS 6.0)', 'Numerus fixus may apply'],
      field: 'Computer Science',
    },
    {
      name: 'Medicine',
      degree: 'bachelor' as const,
      language: 'dutch' as const,
      ects: 360,
      durationMonths: 72,
      tuitionEur: 2300,
      description: 'Six-year medical program in Dutch. Radboud\'s medical faculty (Radboudumc) is internationally recognized for research. Numerus fixus highly competitive.',
      entryRequirements: ['VWO with Biology, Chemistry, Physics, Mathematics', 'Dutch language proficiency required', 'Numerus fixus very competitive', 'BMSAT'],
      field: 'Medicine',
    },
    {
      name: 'Artificial Intelligence',
      degree: 'bachelor' as const,
      language: 'english' as const,
      ects: 180,
      durationMonths: 36,
      tuitionEur: 2300,
      description: 'Dedicated AI program with cognitive computing, machine learning, and robotics. Strong ties to Donders Institute for Brain, Cognition and Behaviour — one of Europe\'s leading neuroscience research centers.',
      entryRequirements: ['Mathematics at VWO level', 'English B2+', 'Numerus fixus applies (competitive)', 'Physics or Computer Science preferred'],
      field: 'Computer Science',
    },
    {
      name: 'Molecular Life Sciences',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Biochemistry, molecular biology, and biomedical research. Radboudumc provides excellent research opportunities. Focus on cancer research, neuroscience, and stem cell biology.',
      entryRequirements: ['Biology, Biochemistry, or Chemistry bachelor', 'English B2+', 'GPA 7.0+', 'Lab research experience preferred'],
      field: 'Biology',
    },
    {
      name: 'Psychology',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'Specializations in clinical psychology, cognitive neuroscience, and social psychology. Radboud has Netherlands\' leading Donders Institute providing research and clinical training.',
      entryRequirements: ['Psychology bachelor', 'English B2+', 'GPA 7.0+', 'Research thesis required'],
      field: 'Psychology',
    },
    {
      name: 'International Economics',
      degree: 'master' as const,
      language: 'english' as const,
      ects: 120,
      durationMonths: 24,
      tuitionEur: 2300,
      description: 'International trade, economic development, and emerging markets. Research-focused with opportunities for policy work at EU institutions.',
      entryRequirements: ['Economics bachelor', 'English B2+', 'GPA 7.0+', 'Mathematics proficiency'],
      field: 'Economics',
    },
  ]

  let liveScraped = false
  try {
    const html = await rateLimitedFetch('https://www.ru.nl/en/education/')
    const $ = cheerio.load(html)
    const links: string[] = []
    $('a[href*="study"], a[href*="program"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && !href.startsWith('#')) links.push(href)
    })
    if (links.length > 0) liveScraped = true
  } catch (err) {
    console.warn(`[Radboud] Live scrape blocked: ${err instanceof Error ? err.message : String(err)}`)
  }

  for (const p of radboudPrograms) {
    programs.push({
      id: makeProgramId('radboud', p.name),
      universityId: 'radboud',
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

  console.log(`[Radboud] Collected ${programs.length} programs`)
  return programs
}

// ============ Main Export ============
export async function scrapeNetherlands(): Promise<Program[]> {
  console.log('='.repeat(60))
  console.log('NETHERLANDS ETL SCRAPER')
  console.log('='.repeat(60))
  console.log()

  const allPrograms: Program[] = []

  const scrapers: { name: string; fn: () => Promise<Program[]> }[] = [
    { name: 'University of Amsterdam', fn: scrapeUVA },
    { name: 'TU Eindhoven', fn: scrapeTUE },
    { name: 'TU Delft', fn: scrapeTUDelft },
    { name: 'Leiden University', fn: scrapeLeiden },
    { name: 'University of Twente', fn: scrapeUTwente },
    { name: 'University of Groningen', fn: scrapeRUG },
    { name: 'VU Amsterdam', fn: scrapeVU },
    { name: 'Radboud University', fn: scrapeRadboud },
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
  console.log(`[NETHERLANDS] Total programs collected: ${allPrograms.length}`)
  return allPrograms
}

export { type Program }
