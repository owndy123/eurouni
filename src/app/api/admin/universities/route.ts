import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'programs.json');

function requireAuth(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const data = readData();
    return NextResponse.json(data.universities);
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const data = readData();

    const newUniversity = {
      id: body.id || `uni-${Date.now()}`,
      name: body.name || '',
      country: body.country || '',
      city: body.city || '',
      logo: body.logo || '🎓',
      website: body.website || '',
      coordinates: {
        lat: body.lat || 0,
        lng: body.lng || 0,
      },
      versions: [
        {
          version: 'v2026',
          effectiveFrom: '2026-01-01',
          effectiveTo: null,
          data: {
            name: body.name || '',
            country: body.country || '',
            city: body.city || '',
            logo: body.logo || '🎓',
            website: body.website || '',
            coordinates: {
              lat: body.lat || 0,
              lng: body.lng || 0,
            },
            lastUpdated: new Date().toISOString().split('T')[0],
          },
        },
      ],
    };

    data.universities.push(newUniversity);
    writeData(data);

    return NextResponse.json(newUniversity, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const data = readData();

    const idx = data.universities.findIndex((u: { id: string }) => u.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    const updated = {
      ...data.universities[idx],
      name: body.name ?? data.universities[idx].name,
      country: body.country ?? data.universities[idx].country,
      city: body.city ?? data.universities[idx].city,
      logo: body.logo ?? data.universities[idx].logo,
      website: body.website ?? data.universities[idx].website,
      coordinates: {
        lat: body.lat ?? data.universities[idx].coordinates?.lat ?? 0,
        lng: body.lng ?? data.universities[idx].coordinates?.lng ?? 0,
      },
    };

    // Update the latest version data
    const versions = updated.versions || [];
    const latestVersion = versions[versions.length - 1] || { version: 'v2026', effectiveFrom: '2026-01-01', effectiveTo: null, data: {} };
    latestVersion.data = {
      name: updated.name,
      country: updated.country,
      city: updated.city,
      logo: updated.logo,
      website: updated.website,
      coordinates: updated.coordinates,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    if (versions.length === 0) versions.push(latestVersion);
    updated.versions = versions;

    data.universities[idx] = updated;
    writeData(data);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update university' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = readData();

    const idx = data.universities.findIndex((u: { id: string }) => u.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    data.universities.splice(idx, 1);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
  }
}
