'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { universities, programs, getLogo } from '@/data/mockData'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => Promise.resolve(MapInner), { ssr: false })

interface DistanceMapProps {
  userLocation?: { lat: number; lng: number }
  maxDistance: number
  onDistanceChange?: (distance: number) => void
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Component to fit map bounds to visible markers
function FitBounds({ markers }: { markers: [number, number][] }) {
  const map = useMap()
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => L.latLng(m[0], m[1])))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, map])
  
  return null
}

// Create custom icon for university markers
function createUniversityIcon(emoji: string, isInRange: boolean) {
  const size = 32
  const borderColor = isInRange ? '#0284c7' : '#94a3b8'
  
  return L.divIcon({
    className: 'university-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid ${borderColor};
        background: linear-gradient(135deg, #0284c7, #0369a1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

function MapInner({ 
  userLocation, 
  maxDistance, 
  universitiesWithPrograms 
}: { 
  userLocation?: { lat: number; lng: number }
  maxDistance: number
  universitiesWithPrograms: Map<string, number>
}) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Calculate which universities are in range
  const { inRangeUniversities, allMarkers } = useMemo(() => {
    const inRange: typeof universities = []
    const markers: [number, number][] = []
    
    universities.forEach(uni => {
      if (userLocation) {
        const dist = calculateDistance(
          userLocation.lat, userLocation.lng,
          uni.coordinates.lat, uni.coordinates.lng
        )
        if (dist <= maxDistance) {
          inRange.push(uni)
        }
      }
      markers.push([uni.coordinates.lat, uni.coordinates.lng])
    })
    
    return { inRangeUniversities: inRange, allMarkers: markers }
  }, [userLocation, maxDistance])
  
  // Default center (Europe)
  const defaultCenter: [number, number] = [50.5, 10.0]
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter
  
  if (!isMounted) {
    return (
      <div className="bg-slate-100 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-slate-500">Loading map...</div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">University Locations</h3>
        <p className="text-sm text-slate-500 mt-1">
          {userLocation 
            ? `${inRangeUniversities.length} universities within ${maxDistance}km`
            : `All ${universities.length} universities across Europe`
          }
        </p>
      </div>
      
      <div className="h-80 relative">
        <MapContainer
          center={center}
          zoom={userLocation ? 6 : 5}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Draw radius circle around user location */}
          {userLocation && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={maxDistance * 1000} // Convert km to meters
              pathOptions={{
                color: '#0284c7',
                fillColor: '#0284c7',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}
          
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: 'user-marker',
                html: `
                  <div style="
                    width: 16px;
                    height: 16px;
                    background: #0284c7;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-medium">Your Location</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* University markers */}
          {universities.map(uni => {
            const dist = userLocation 
              ? calculateDistance(
                  userLocation.lat, userLocation.lng,
                  uni.coordinates.lat, uni.coordinates.lng
                )
              : null
            const isInRange = dist !== null && dist <= maxDistance
            const logoEmoji = getLogo(uni.id) || '🎓'
            const programCount = universitiesWithPrograms.get(uni.id) || 0
            
            return (
              <Marker
                key={uni.id}
                position={[uni.coordinates.lat, uni.coordinates.lng]}
                icon={createUniversityIcon(logoEmoji, isInRange)}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl bg-sky-100 shrink-0">
                        {logoEmoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm">{uni.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{uni.city}, {uni.country}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Programs</span>
                        <span className="font-medium text-primary-600">{programCount}</span>
                      </div>
                      {dist !== null && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-slate-600">Distance</span>
                          <span className="font-medium">{Math.round(dist)} km</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => router.push(`/programs?university=${uni.id}`)}
                      className="mt-3 w-full bg-primary-600 text-white text-xs py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View Programs
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}
          
          {/* Fit bounds to show all markers */}
          <FitBounds markers={allMarkers} />
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
            <span>In range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span>Out of range</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary-600 border-2 border-white"></div>
              <span>Your location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DistanceMap({ userLocation, maxDistance, onDistanceChange }: DistanceMapProps) {
  // Pre-calculate program counts per university
  const universitiesWithPrograms = useMemo(() => {
    const map = new Map<string, number>()
    universities.forEach(uni => {
      const count = programs.filter(p => p.universityId === uni.id).length
      map.set(uni.id, count)
    })
    return map
  }, [])
  
  return (
    <MapComponent 
      userLocation={userLocation}
      maxDistance={maxDistance}
      universitiesWithPrograms={universitiesWithPrograms}
    />
  )
}
