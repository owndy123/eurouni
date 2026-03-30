/**
 * API Route: /api/universities
 * 
 * GET: List all universities (supports filtering)
 * POST: Create new university (admin only - future auth)
 * PATCH: Update university (admin only - future auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import * as db from '@/lib/db'

// GET /api/universities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country')

    const universities = await db.getUniversities()

    // Filter by country if specified
    const filtered = country
      ? universities.filter(u => u.country === country)
      : universities

    return NextResponse.json({
      success: true,
      data: filtered,
      meta: {
        total: filtered.length,
        country: country || null,
      },
    })
  } catch (error) {
    console.error('[API/universities] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

// POST /api/universities - Create new university (admin)
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
    const requiredFields = ['name', 'country', 'city', 'coordinates']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // TODO: Insert into Supabase
    return NextResponse.json({
      success: true,
      message: 'University creation endpoint ready - connect to Supabase admin API',
      data: null,
    }, { status: 201 })

  } catch (error) {
    console.error('[API/universities] POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create university' },
      { status: 500 }
    )
  }
}

// PATCH /api/universities - Update university (admin)
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
        { success: false, error: 'University ID required' },
        { status: 400 }
      )
    }

    // TODO: Update in Supabase
    return NextResponse.json({
      success: true,
      message: 'University update endpoint ready - connect to Supabase admin API',
      data: updates,
    })

  } catch (error) {
    console.error('[API/universities] PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update university' },
      { status: 500 }
    )
  }
}
