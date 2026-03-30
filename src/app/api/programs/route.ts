/**
 * API Route: /api/programs
 * 
 * GET: List all programs (supports filtering)
 * POST: Create new program (admin only - future auth)
 * PATCH: Update program (admin only - future auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import * as db from '@/lib/db'
import type { ProgramFilters } from '@/lib/db'

// GET /api/programs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters
    const filters: ProgramFilters = {}
    
    const country = searchParams.get('country')
    if (country) filters.country = country
    
    const field = searchParams.get('field')
    if (field) filters.field = field
    
    const degree = searchParams.get('degree') as 'bachelor' | 'master' | null
    if (degree && (degree === 'bachelor' || degree === 'master')) {
      filters.degree = degree
    }
    
    const language = searchParams.get('language')
    if (language) filters.language = language
    
    const maxTuition = searchParams.get('maxTuition')
    if (maxTuition) filters.maxTuition = parseInt(maxTuition, 10)
    
    const freeOnly = searchParams.get('freeOnly')
    if (freeOnly === 'true') filters.freeOnly = true

    const programs = await db.getPrograms(filters)

    return NextResponse.json({
      success: true,
      data: programs,
      meta: {
        total: programs.length,
        filters: Object.keys(filters).length > 0 ? filters : null,
      },
    })
  } catch (error) {
    console.error('[API/programs] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

// POST /api/programs - Create new program (admin)
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    // TODO: Add admin authentication check
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader?.startsWith('Bearer ')) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['universityId', 'name', 'degree', 'language', 'ects', 'durationMonths', 'tuitionEur', 'field']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // TODO: Insert into Supabase
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: 'Program creation endpoint ready - connect to Supabase admin API',
      data: null,
    }, { status: 201 })

  } catch (error) {
    console.error('[API/programs] POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create program' },
      { status: 500 }
    )
  }
}

// PATCH /api/programs - Update program (admin)
export async function PATCH(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    // TODO: Add admin authentication check
    
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Program ID required' },
        { status: 400 }
      )
    }

    // TODO: Update in Supabase
    return NextResponse.json({
      success: true,
      message: 'Program update endpoint ready - connect to Supabase admin API',
      data: updates,
    })

  } catch (error) {
    console.error('[API/programs] PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update program' },
      { status: 500 }
    )
  }
}
