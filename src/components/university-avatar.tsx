'use client'

import { cn } from '@/lib/utils'

// Country-specific color palettes (background, text)
const COUNTRY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Slovakia:    { bg: '#1e40af', text: '#ffffff', border: '#1d4ed8' },
  'Czech Republic': { bg: '#6d28d9', text: '#ffffff', border: '#7c3aed' },
  Austria:    { bg: '#b91c1c', text: '#ffffff', border: '#dc2626' },
  Poland:     { bg: '#047857', text: '#ffffff', border: '#059669' },
  Hungary:    { bg: '#b45309', text: '#ffffff', border: '#d97706' },
  Germany:    { bg: '#1e3a5f', text: '#ffffff', border: '#2563eb' },
  Netherlands:{ bg: '#ea580c', text: '#ffffff', border: '#f97316' },
}

function getInitials(name: string): string {
  // Get 2-character initials from name
  const words = name.split(' ').filter(w => w.length > 0)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function getColorForUniversity(country: string): { bg: string; text: string; border: string } {
  return COUNTRY_COLORS[country] || { bg: '#475569', text: '#ffffff', border: '#64748b' }
}

interface UniversityAvatarProps {
  name: string
  country: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function UniversityAvatar({ name, country, size = 'md', className }: UniversityAvatarProps) {
  const initials = getInitials(name)
  const colors = getColorForUniversity(country)

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-lg font-bold shrink-0 ring-1 ring-black/10',
        SIZE_CLASSES[size],
        className
      )}
      style={{ backgroundColor: colors.bg, color: colors.text }}
      title={name}
    >
      <span className="select-none" style={{ fontSize: 'inherit', fontWeight: 700 }}>
        {initials}
      </span>
    </div>
  )
}

// Fallback: initials SVG data URL for use as img src
export function getUniversityAvatarUrl(name: string, country: string, size = 40): string {
  const initials = getInitials(name)
  const colors = getColorForUniversity(country)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="6" fill="${encodeURIComponent(colors.bg)}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="${encodeURIComponent(colors.text)}" font-family="system-ui,sans-serif" font-size="${Math.round(size * 0.38)}" font-weight="700">${initials}</text></svg>`
  return `data:image/svg+xml,${svg}`
}
