import { NextResponse } from 'next/server'
import { scrapeAllUniversities, checkDataFreshness } from '@/lib/scraper'
import { universities } from '@/data/mockData'

export async function GET() {
  try {
    // Check freshness of current data
    const freshness = await checkDataFreshness(universities)
    
    const summary = {
      totalUniversities: universities.length,
      freshness: {
        fresh: freshness.filter(f => f.status === 'fresh').length,
        stale: freshness.filter(f => f.status === 'stale').length,
        outdated: freshness.filter(f => f.status === 'outdated').length,
      },
      note: 'Live scraping available via POST /api/sync'
    }
    
    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check data freshness' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // In production, this would scrape university websites
    // For now, it returns the scraping status
    const result = await scrapeAllUniversities()
    
    return NextResponse.json({
      message: 'Scraping initiated',
      ...result,
      note: 'Full scraping requires puppeteer/cheerio setup'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed' },
      { status: 500 }
    )
  }
}
