'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Sliders, PieChart, CheckCircle } from 'lucide-react'
import { WeightConfig, DEFAULT_WEIGHTS } from '@/lib/calculator'

interface CalculatorUIProps {
  weights: WeightConfig
  onWeightsChange: (weights: WeightConfig) => void
}

export default function CalculatorUI({ weights, onWeightsChange }: CalculatorUIProps) {
  const [isOpen, setIsOpen] = useState(false)

  const weightLabels = {
    academic: 'Academic Fit',
    location: 'Location',
    language: 'Language',
    budget: 'Budget',
    career: 'Career Goals',
  }

  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-slate-900">Calculator Weights</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${total === 1 ? 'text-green-600' : 'text-red-500'}`}>
            Total: {(total * 100).toFixed(0)}%
          </span>
          <Sliders className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="p-4 border-t border-slate-100"
        >
          <div className="grid gap-4">
            {(Object.keys(weights) as Array<keyof WeightConfig>).map((key) => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-28 text-sm text-slate-600">{weightLabels[key]}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights[key] * 100}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100
                    const newWeights = { ...weights, [key]: val }
                    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0)
                    const normalized = {
                      academic: newWeights.academic / sum,
                      location: newWeights.location / sum,
                      language: newWeights.language / sum,
                      budget: newWeights.budget / sum,
                      career: newWeights.career / sum,
                    } as WeightConfig
                    onWeightsChange(normalized)
                  }}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="w-12 text-right text-sm font-medium text-slate-700">
                  {Math.round(weights[key] * 100)}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => onWeightsChange(DEFAULT_WEIGHTS)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset to Default
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">
                Scores are weighted averages
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}