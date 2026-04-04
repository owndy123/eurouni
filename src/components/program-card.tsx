'use client'

import { motion } from 'framer-motion'
import { Clock, GraduationCap, Languages, Euro, ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Program, University, getUniversityWithLogo } from '@/data/mockData'
import { UniversityAvatar } from './university-avatar'

interface ProgramCardProps {
  program: Program
  university: University
  score?: number
}

export default function ProgramCard({ program, university, score }: ProgramCardProps) {
  const uniWithLogo = getUniversityWithLogo(university.id) || university
  
  const languageMap: Record<string, string> = {
    english: 'English',
    local: 'Local',
    both: 'English & Local',
    german: 'German',
    polish: 'Polish',
  }
  const languageLabel = languageMap[program.language] || 'Mixed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all"
    >
      {/* Hover reveal content */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <UniversityAvatar
              name={uniWithLogo.name}
              country={uniWithLogo.country}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-slate-900">{program.name}</h3>
              <p className="text-sm text-slate-500">{university.name}</p>
            </div>
          </div>
          {score !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              score >= 70 ? 'bg-green-100 text-green-700' :
              score >= 50 ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {Math.round(score)}%
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            {program.degree === 'bachelor' ? "Bachelor's" : "Master's"}
          </span>
          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full flex items-center gap-1">
            <Languages className="w-3 h-3" />
            {languageLabel}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            {program.field}
          </span>
        </div>

        {/* Entry Requirements - always visible */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Entry Requirements</h4>
          <p className="text-sm text-slate-700 line-clamp-2">
            {program.entryRequirements.length > 0 ? program.entryRequirements.join(' • ') : 'View on university website'}
          </p>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-3 gap-3 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span>{program.ects} ECTS</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{program.durationMonths}mo</span>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-slate-400" />
            <span>{program.tuitionEur === 0 ? 'Free' : `€${program.tuitionEur}/yr`}</span>
          </div>
        </div>



        {/* Action */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
          <Link
            href={university.website}
            target="_blank"
            className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            Visit Website
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}