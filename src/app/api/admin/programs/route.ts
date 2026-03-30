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
    return NextResponse.json(data.programs);
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

    const newProgram = {
      id: body.id || `prog-${Date.now()}`,
      universityId: body.universityId || '',
      name: body.name || '',
      degree: body.degree || 'bachelor',
      language: body.language || 'english',
      ects: body.ects || 180,
      durationMonths: body.durationMonths || 36,
      tuitionEur: body.tuitionEur || 0,
      description: body.description || '',
      entryRequirements: body.entryRequirements || [],
      field: body.field || '',
      versions: [
        {
          version: 'v2026',
          effectiveFrom: '2026-01-01',
          effectiveTo: null,
          data: {
            name: body.name || '',
            degree: body.degree || 'bachelor',
            language: body.language || 'english',
            ects: body.ects || 180,
            durationMonths: body.durationMonths || 36,
            tuitionEur: body.tuitionEur || 0,
            description: body.description || '',
            entryRequirements: body.entryRequirements || [],
            field: body.field || '',
            lastUpdated: new Date().toISOString().split('T')[0],
          },
        },
      ],
    };

    data.programs.push(newProgram);
    writeData(data);

    return NextResponse.json(newProgram, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const data = readData();

    const idx = data.programs.findIndex((p: { id: string }) => p.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    const updated = {
      ...data.programs[idx],
      universityId: body.universityId ?? data.programs[idx].universityId,
      name: body.name ?? data.programs[idx].name,
      degree: body.degree ?? data.programs[idx].degree,
      language: body.language ?? data.programs[idx].language,
      ects: body.ects ?? data.programs[idx].ects,
      durationMonths: body.durationMonths ?? data.programs[idx].durationMonths,
      tuitionEur: body.tuitionEur ?? data.programs[idx].tuitionEur,
      description: body.description ?? data.programs[idx].description,
      entryRequirements: body.entryRequirements ?? data.programs[idx].entryRequirements,
      field: body.field ?? data.programs[idx].field,
    };

    // Update latest version
    const versions = updated.versions || [];
    const latestVersion = versions[versions.length - 1] || { version: 'v2026', effectiveFrom: '2026-01-01', effectiveTo: null, data: {} };
    latestVersion.data = {
      name: updated.name,
      degree: updated.degree,
      language: updated.language,
      ects: updated.ects,
      durationMonths: updated.durationMonths,
      tuitionEur: updated.tuitionEur,
      description: updated.description,
      entryRequirements: updated.entryRequirements,
      field: updated.field,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    if (versions.length === 0) versions.push(latestVersion);
    updated.versions = versions;

    data.programs[idx] = updated;
    writeData(data);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = readData();

    const idx = data.programs.findIndex((p: { id: string }) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    data.programs.splice(idx, 1);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
