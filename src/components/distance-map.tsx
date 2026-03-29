'use client'

import { useEffect, useState } from 'react'
import { programs, universities, getUniversityWithLogo } from '@/data/mockData'

// Note: In production, use dynamic import with SSR disabled
// This is a placeholder - full implementation needs 'react-leaflet'
// Dynamic import pattern shown below

interface DistanceMapProps {
  userLocation?: { lat: number; lng: number }
  maxDistance: number
  onDistanceChange?: (distance: number) => void
}

export default function DistanceMap({ userLocation, maxDistance, onDistanceChange }: DistanceMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    import('react-leaflet').then((mod) => {
      import('leaflet').then(() => {
        setMapComponent(() => mod.MapContainer)
      })
    }).catch(() => {
      // Fallback - show static representation
    })
  }, [])

  // Fallback UI when Leaflet isn't loaded
  if (!MapComponent) {
    return (
      <div className="bg-slate-100 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">University Locations</h3>
        <div className="space-y-3">
          {universities.slice(0, 6).map((uni) => {
            const uniPrograms = programs.filter(p => p.universityId === uni.id)
            const uniWithLogo = getUniversityWithLogo(uni.id) || uni
            const logoUrl = uniWithLogo.logo
            return (
              <div key={uni.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  {logoUrl.startsWith('http') ? (
                    <img src={logoUrl} alt={uni.name} className="w-6 h-6 object-contain rounded" />
                  ) : (
                    <span>{logoUrl}</span>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{uni.name}</p>
                    <p className="text-xs text-slate-500">{uni.city}, {uni.country}</p>
                  </div>
                </div>
                <span className="text-xs text-primary-600">{uniPrograms.length} programs</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
          Interactive map will show here with distance radius filtering
        </p>
      </div>
    )
  }

  return null // Placeholder for actual map
}