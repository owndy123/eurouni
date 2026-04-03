/**
 * EuroUni Data Source
 * Uses mockData directly (which imports from programs.json).
 * For Supabase, set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.
 */

import { isSupabaseConfigured } from './supabase'
import { universities as _unis, programs as _progs } from '@/data/mockData'
import { UNIVERSITY_LOGOS } from '@/data/universityLogos'

export interface University {
  id: string; name: string; country: string; city: string
  logo: string; website: string
  coordinates: { lat: number; lng: number }; lastUpdated: string
}

export interface Program {
  id: string; universityId: string; name: string
  degree: 'bachelor' | 'master'
  language: 'english' | 'local' | 'both' | 'german' | 'polish' | 'hungarian' | 'slovak'
  ects: number; durationMonths: number; tuitionEur: number
  description: string; entryRequirements: string[]; field: string; lastUpdated: string
}

// Load from mockData (which reads from data/programs.json)
export const universities: University[] = _unis as University[]
export const programs: Program[] = _progs as Program[]

export function getUniversity(id: string): University | undefined {
  return (universities as University[]).find(u => u.id === id)
}

export function getProgramsForUniversity(universityId: string): Program[] {
  return (programs as Program[]).filter(p => p.universityId === universityId)
}

export function getProgramsByField(field: string): Program[] {
  return (programs as Program[]).filter(p => p.field.toLowerCase().includes(field.toLowerCase()))
}

export function getProgramsByLanguage(language: string): Program[] {
  return (programs as Program[]).filter(p => p.language === language)
}

export function getCountries(): string[] {
  return Array.from(new Set((universities as University[]).map(u => u.country)))
}

export function getStats() {
  const unis = universities as University[]
  const progs = programs as Program[]
  return {
    totalUniversities: unis.length,
    totalPrograms: progs.length,
    countries: getCountries().length,
    englishPrograms: progs.filter(p => p.language === 'english').length,
    freeTuition: progs.filter(p => p.tuitionEur === 0).length,
  }
}

export function getLogo(uniId: string): string {
  return UNIVERSITY_LOGOS[uniId] || '🎓'
}

export function getUniversityWithLogo(id: string): University | undefined {
  const uni = (universities as University[]).find(u => u.id === id)
  if (!uni) return undefined
  return { ...uni, logo: UNIVERSITY_LOGOS[uni.id] || uni.logo }
}

export async function reload(): Promise<void> {
  // In browser, refresh the page to reload data
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

export function getDataMode(): 'supabase' | 'json' | 'mock' {
  return isSupabaseConfigured ? 'supabase' : 'mock'
}
