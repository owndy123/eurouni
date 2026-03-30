import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

function requireAuth(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth) return auth;

  try {
    const body = await req.json().catch(() => ({}));
    const message = body.message || `Admin update: ${new Date().toISOString()}`;

    execSync('git add data/programs.json', { cwd: process.cwd() });
    execSync(`git commit -m "${message}"`, { cwd: process.cwd() });
    execSync('git push', { cwd: process.cwd() });

    return NextResponse.json({ success: true, message: 'Committed and pushed' });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Git commit/push failed', details: error }, { status: 500 });
  }
}
