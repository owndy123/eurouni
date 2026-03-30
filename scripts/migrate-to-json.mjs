#!/usr/bin/env node
/**
 * Migration Script: mockData.ts → data/programs.json
 * Run: node scripts/migrate-to-json.mjs
 */

import * as fs from 'fs'
import * as path from 'path'

const ROOT = process.cwd()
const VERSION = 'v2026'
const EFFECTIVE_DATE = '2026-01-01'

const bakPath = path.join(ROOT, 'src', 'data', 'mockData.ts.bak')
const bakContent = fs.readFileSync(bakPath, 'utf-8')

// Helper: find the array literal starting after `=`
function findArrayStart(content, marker) {
  const markerIdx = content.indexOf(marker)
  if (markerIdx === -1) throw new Error(`Marker not found: ${marker}`)
  const eqIdx = content.indexOf('=', markerIdx)
  if (eqIdx === -1) throw new Error(`No = after marker: ${marker}`)
  const bracketStart = content.indexOf('[', eqIdx)
  if (bracketStart === -1) throw new Error(`No [ after = in: ${marker}`)
  return bracketStart
}

function extractArray(content, marker) {
  const bracketStart = findArrayStart(content, marker)
  let bc = 0, end = bracketStart
  for (let i = bracketStart; i < content.length; i++) {
    if (content[i] === '[') bc++
    else if (content[i] === ']') { bc--; if (bc === 0) { end = i; break } }
  }
  return { start: bracketStart, end, str: content.slice(bracketStart, end + 1) }
}

// Extract country university arrays and combine
function extractUniversities(content) {
  const countries = [
    'slovakUniversities', 'czechUniversities', 'austrianUniversities',
    'polishUniversities', 'hungarianUniversities', 'germanUniversities', 'netherlandsUniversities'
  ]
  const result = []

  for (const country of countries) {
    const marker = `export const ${country}: University[]`
    try {
      const { str } = extractArray(content, marker)
      const arr = eval(str)
      result.push(...arr)
      console.log(`  + ${country}: ${arr.length}`)
    } catch (e) {
      console.error(`  ! ${country}: ${e.message}`)
    }
  }
  return result
}

function extractPrograms(content) {
  const { str } = extractArray(content, 'export const programs: Program[]')
  return eval(str)
}

console.log('Extracting universities...')
const universities = extractUniversities(bakContent)
console.log(`Total: ${universities.length} universities\n`)

console.log('Extracting programs...')
const programs = extractPrograms(bakContent)
console.log(`Total: ${programs.length} programs\n`)

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
console.log(`[WRITE] ${outputPath}`)
console.log('\nMigration complete!')
console.log(`  Universities: ${output.universities.length}`)
console.log(`  Programs: ${output.programs.length}`)
console.log(`  Version: ${VERSION}`)
