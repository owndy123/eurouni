/**
 * EuroUni Mock Data
 * Auto-generated from data/programs.json
 * DO NOT EDIT MANUALLY — run: node scripts/regenerate-mock-data.js
 */

import { UNIVERSITY_LOGOS } from './universityLogos'

export interface University {
  id: string
  name: string
  country: string
  city: string
  logo: string
  website: string
  coordinates: { lat: number; lng: number }
  lastUpdated: string
}

export interface Program {
  id: string
  universityId: string
  name: string
  degree: 'bachelor' | 'master'
  language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak' | 'czech' | 'dutch'
  ects: number
  durationMonths: number
  tuitionEur: number
  description: string
  entryRequirements: string[]
  field: string
  lastUpdated: string
}

// ============ DATA (auto-generated) ============

import rawData from '../../data/programs.json'

export const universities: University[] = rawData.universities.map(u => ({
  id: u.id,
  name: u.name,
  country: u.country,
  city: u.city,
  logo: UNIVERSITY_LOGOS[u.id] || u.logo || '🎓',
  website: u.website,
  coordinates: u.coordinates,
  lastUpdated: u.versions?.[0]?.data?.lastUpdated || new Date().toISOString().split('T')[0],
}))

export const programs: Program[] = rawData.programs.map(p => ({
  id: p.id,
  universityId: p.universityId,
  name: p.name,
  degree: p.degree as Program['degree'],
  language: p.language as Program['language'],
  ects: p.ects,
  durationMonths: p.durationMonths,
  tuitionEur: p.tuitionEur,
  description: p.description || '',
  entryRequirements: p.entryRequirements || [],
  field: p.field || 'Unknown',
  lastUpdated: p.lastUpdated || new Date().toISOString().split('T')[0],
}))

// ============ HELPERS ============

export function getUniversity(id: string): University | undefined {
  return universities.find(u => u.id === id)
}

export function getProgramsForUniversity(universityId: string): Program[] {
  return programs.filter(p => p.universityId === universityId)
}

export function getProgramsByField(field: string): Program[] {
  return programs.filter(p => p.field.toLowerCase().includes(field.toLowerCase()))
}

export function getProgramsByLanguage(language: string): Program[] {
  return programs.filter(p => p.language === language)
}

export function getCountries(): string[] {
  return Array.from(new Set(universities.map(u => u.country)))
}

export function getStats() {
  return {
    totalUniversities: universities.length,
    totalPrograms: programs.length,
    countries: getCountries().length,
    englishPrograms: programs.filter(p => p.language === 'english').length,
    freeTuition: programs.filter(p => p.tuitionEur === 0).length,
  }
}

// ============ UNIVERSITY LOGOS ============

export function getLogo(uniId: string): string {
  return UNIVERSITY_LOGOS[uniId] || '🎓'
}

export function getUniversityWithLogo(id: string): University | undefined {
  const uni = universities.find(u => u.id === id)
  if (!uni) return undefined
  return {
    ...uni,
    logo: UNIVERSITY_LOGOS[uni.id] || uni.logo
  }
}
