/**
 * Migration Script: mockData.ts → data/programs.json
 * Run: npx ts-node scripts/migrate-to-json.ts
 * 
 * This script:
 * 1. Reads current mockData.ts values
 * 2. Transforms them into the new JSON structure with a "v2026" version
 * 3. Writes to data/programs.json
 * 4. Creates a backup of the old mockData.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Types
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
  language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak'
  ects: number
  durationMonths: number
  tuitionEur: number
  description: string
  entryRequirements: string[]
  field: string
  lastUpdated: string
}

// Versioned snapshot type
interface VersionedData<T> {
  version: string
  effectiveFrom: string
  effectiveTo: string | null
  data: T
}

// JSON output structure
interface UniversityJSON {
  id: string
  name: string
  country: string
  city: string
  logo: string
  website: string
  coordinates: { lat: number; lng: number }
  versions: VersionedData<Omit<University, 'id' | 'versions'>>[]
}

interface ProgramJSON {
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
  versions: VersionedData<Omit<Program, 'id' | 'universityId' | 'versions'>>[]
}

interface ProgramsJSON {
  universities: UniversityJSON[]
  programs: ProgramJSON[]
  meta: {
    lastUpdated: string
    version: string
    migratedFrom: string
  }
}

const VERSION = 'v2026'
const EFFECTIVE_DATE = '2026-01-01'
const BACKUP_SUFFIX = '.bak'

function backupFile(filePath: string): void {
  const backupPath = filePath + BACKUP_SUFFIX
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath)
    console.log(`[BACKUP] Created ${backupPath}`)
  }
}

function transformUniversity(uni: University): UniversityJSON {
  return {
    id: uni.id,
    name: uni.name,
    country: uni.country,
    city: uni.city,
    logo: uni.logo,
    website: uni.website,
    coordinates: uni.coordinates,
    versions: [
      {
        version: VERSION,
        effectiveFrom: EFFECTIVE_DATE,
        effectiveTo: null, // current
        data: {
          name: uni.name,
          country: uni.country,
          city: uni.city,
          logo: uni.logo,
          website: uni.website,
          coordinates: uni.coordinates,
          lastUpdated: uni.lastUpdated,
        },
      },
    ],
  }
}

function transformProgram(prog: Program): ProgramJSON {
  return {
    id: prog.id,
    universityId: prog.universityId,
    name: prog.name,
    degree: prog.degree,
    language: prog.language,
    ects: prog.ects,
    durationMonths: prog.durationMonths,
    tuitionEur: prog.tuitionEur,
    description: prog.description,
    entryRequirements: prog.entryRequirements,
    field: prog.field,
    versions: [
      {
        version: VERSION,
        effectiveFrom: EFFECTIVE_DATE,
        effectiveTo: null, // current
        data: {
          name: prog.name,
          degree: prog.degree,
          language: prog.language,
          ects: prog.ects,
          durationMonths: prog.durationMonths,
          tuitionEur: prog.tuitionEur,
          description: prog.description,
          entryRequirements: prog.entryRequirements,
          field: prog.field,
          lastUpdated: prog.lastUpdated,
        },
      },
    ],
  }
}

async function main(): Promise<void> {
  console.log('='.repeat(60))
  console.log('EuroUni: Migration to JSON Data Layer')
  console.log(`Target version: ${VERSION}`)
  console.log('='.repeat(60))
  console.log()

  // Import mockData directly by evaluating the file
  // We read and parse it to get universities and programs arrays
  const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts')
  const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8')

  // Backup original
  backupFile(mockDataPath)

  // Extract universities array using regex (since we can't dynamically import non-module TS)
  // We use eval on the universities export
  const universitiesMatch = mockDataContent.match(/export const universities: University\[\] = (\[[\s\S]*?\]);/)
  const programsMatch = mockDataContent.match(/export const programs: Program\[\] = (\[[\s\S]*?\]);/)

  if (!universitiesMatch || !programsMatch) {
    throw new Error('Could not parse universities or programs from mockData.ts')
  }

  // Use ts-node to import the TypeScript module directly
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockData = require('../src/data/mockData')
  const data: { universities: University[]; programs: Program[] } = {
    universities: mockData.universities,
    programs: mockData.programs,
  }

  console.log(`Found ${data.universities.length} universities and ${data.programs.length} programs`)

  // Transform
  const jsonUniversities = data.universities.map(transformUniversity)
  const jsonPrograms = data.programs.map(transformProgram)

  const output: ProgramsJSON = {
    universities: jsonUniversities,
    programs: jsonPrograms,
    meta: {
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0',
      migratedFrom: 'mockData.ts',
    },
  }

  // Write to data directory
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const outputPath = path.join(dataDir, 'programs.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`[WRITE] Created ${outputPath}`)

  console.log()
  console.log('Migration complete!')
  console.log(`  - Universities: ${jsonUniversities.length}`)
  console.log(`  - Programs: ${jsonPrograms.length}`)
  console.log(`  - Version: ${VERSION}`)
}

main().catch(err => {
  console.error('[ERROR]', err)
  process.exit(1)
})
