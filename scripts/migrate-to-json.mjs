#!/usr/bin/env node
/**
 * Migration Script: mockData.ts → data/programs.json
 * Run: node scripts/migrate-to-json.mjs
 * 
 * Reads mockData.ts backup and generates the versioned JSON.
 */

import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.join(process.cwd())
const VERSION = 'v2026'
const EFFECTIVE_DATE = '2026-01-01'

// Read the backup (original TypeScript file)
const bakPath = path.join(ROOT, 'src', 'data', 'mockData.ts.bak')
const bakContent = fs.readFileSync(bakPath, 'utf-8')

// Extract array content - find the large array literals
// We look for: export const universities: University[] = [...];
// and: export const programs: Program[] = [...];

function extractArray(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker)
  if (startIdx === -1) throw new Error(`Could not find: ${startMarker}`)
  const dataStart = content.indexOf('[', startIdx)
  let bracketCount = 0
  let dataEnd = dataStart
  for (let i = dataStart; i < content.length; i++) {
    if (content[i] === '[') bracketCount++
    else if (content[i] === ']') { bracketCount--; if (bracketCount === 0) { dataEnd = i; break } }
  }
  return content.slice(dataStart, dataEnd + 1)
}

const uniArrayStr = extractArray(bakContent, 'export const universities', '// ============ PROGRAMS')
const progArrayStr = extractArray(bakContent, 'export const programs', '// Helper functions')

// Use Function constructor to safely eval array literals (they contain only plain data)
const universities = new Function(`return ${uniArrayStr}`)()
const programs = new Function(`return ${progArrayStr}`)()

console.log(`Found ${universities.length} universities and ${programs.length} programs`)

const transformUniversity = (uni) => ({
  id: uni.id, name: uni.name, country: uni.country, city: uni.city,
  logo: uni.logo, website: uni.website, coordinates: uni.coordinates,
  versions: [{
    version: VERSION,
    effectiveFrom: EFFECTIVE_DATE,
    effectiveTo: null,
    data: { name: uni.name, country: uni.country, city: uni.city, logo: uni.logo,
            website: uni.website, coordinates: uni.coordinates, lastUpdated: uni.lastUpdated },
  }],
})

const transformProgram = (prog) => ({
  id: prog.id, universityId: prog.universityId, name: prog.name,
  degree: prog.degree, language: prog.language, ects: prog.ects,
  durationMonths: prog.durationMonths, tuitionEur: prog.tuitionEur,
  description: prog.description, entryRequirements: prog.entryRequirements,
  field: prog.field,
  versions: [{
    version: VERSION,
    effectiveFrom: EFFECTIVE_DATE,
    effectiveTo: null,
    data: { name: prog.name, degree: prog.degree, language: prog.language,
            ects: prog.ects, durationMonths: prog.durationMonths, tuitionEur: prog.tuitionEur,
            description: prog.description, entryRequirements: prog.entryRequirements,
            field: prog.field, lastUpdated: prog.lastUpdated },
  }],
})

const output = {
  universities: universities.map(transformUniversity),
  programs: programs.map(transformProgram),
  meta: {
    lastUpdated: new Date().toISOString().split('T')[0],
    version: '1.0',
    migratedFrom: 'mockData.ts',
  },
}

const dataDir = path.join(ROOT, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const outputPath = path.join(dataDir, 'programs.json')
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
console.log(`[WRITE] Created ${outputPath}`)
console.log()
console.log('Migration complete!')
console.log(`  - Universities: ${output.universities.length}`)
console.log(`  - Programs: ${output.programs.length}`)
console.log(`  - Version: ${VERSION}`)
