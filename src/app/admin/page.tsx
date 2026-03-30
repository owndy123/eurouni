'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  logo?: string;
  website?: string;
  coordinates?: { lat: number; lng: number };
};

type Program = {
  id: string;
  universityId: string;
  name: string;
  degree: string;
  language: string;
  ects: number;
  durationMonths: number;
  tuitionEur: number;
  description?: string;
  entryRequirements?: string[];
  field?: string;
};

type UniversityForm = Omit<University, 'id'> & { id?: string };
type ProgramForm = Omit<Program, 'id'> & { id?: string };

function authHeaders() {
  return { 'X-Admin-Password': ADMIN_PASSWORD };
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('universities');

  // Universities state
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [universityForm, setUniversityForm] = useState<UniversityForm>({ id: '', name: '', city: '', country: '', logo: '', website: '', coordinates: { lat: 0, lng: 0 } });
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const [addUniversityForm, setAddUniversityForm] = useState<UniversityForm>({ name: '', city: '', country: '', logo: '🎓', website: '', coordinates: { lat: 0, lng: 0 } });
  const [savingUniversity, setSavingUniversity] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  // Programs state
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState<ProgramForm>({ universityId: '', name: '', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 0, description: '', field: '' });
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [addProgramForm, setAddProgramForm] = useState<ProgramForm>({ universityId: '', name: '', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 0, description: '', field: '' });
  const [savingProgram, setSavingProgram] = useState(false);
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    setUniversitiesLoading(true);
    try {
      const res = await fetch('/api/admin/universities', { headers: authHeaders() });
      if (res.ok) setUniversities(await res.json());
    } finally {
      setUniversitiesLoading(false);
    }
  }, []);

  const fetchPrograms = useCallback(async () => {
    setProgramsLoading(true);
    try {
      const res = await fetch('/api/admin/programs', { headers: authHeaders() });
      if (res.ok) setPrograms(await res.json());
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUniversities();
      fetchPrograms();
    }
  }, [authenticated, fetchUniversities, fetchPrograms]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/universities', { headers: { 'X-Admin-Password': password } });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        alert('Incorrect password');
      }
    } catch {
      alert('Connection error');
    } finally {
      setVerifying(false);
    }
  }

  async function handleSaveUniversity() {
    setSavingUniversity(true);
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUniversity!.id,
          name: universityForm.name,
          city: universityForm.city,
          country: universityForm.country,
          logo: universityForm.logo,
          website: universityForm.website,
          lat: universityForm.coordinates?.lat,
          lng: universityForm.coordinates?.lng,
        }),
      });
      if (res.ok) {
        await fetchUniversities();
        setEditingUniversity(null);
      }
    } finally {
      setSavingUniversity(false);
    }
  }

  async function handleAddUniversity() {
    setSavingUniversity(true);
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addUniversityForm.name,
          city: addUniversityForm.city,
          country: addUniversityForm.country,
          logo: addUniversityForm.logo,
          website: addUniversityForm.website,
          lat: addUniversityForm.coordinates?.lat,
          lng: addUniversityForm.coordinates?.lng,
        }),
      });
      if (res.ok) {
        await fetchUniversities();
        setShowAddUniversity(false);
        setAddUniversityForm({ name: '', city: '', country: '', logo: '🎓', website: '', coordinates: { lat: 0, lng: 0 } });
      }
    } finally {
      setSavingUniversity(false);
    }
  }

  async function handleDeleteUniversity(id: string) {
    if (!confirm('Delete this university and all its programs?')) return;
    await fetch(`/api/admin/universities?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    await fetchUniversities();
    await fetchPrograms();
  }

  async function handleSaveProgram() {
    setSavingProgram(true);
    try {
      const res = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(programForm),
      });
      if (res.ok) {
        await fetchPrograms();
        setEditingProgram(null);
      }
    } finally {
      setSavingProgram(false);
    }
  }

  async function handleAddProgram() {
    setSavingProgram(true);
    try {
      const res = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(addProgramForm),
      });
      if (res.ok) {
        await fetchPrograms();
        setShowAddProgram(false);
        setAddProgramForm({ universityId: '', name: '', degree: 'bachelor', language: 'english', ects: 180, durationMonths: 36, tuitionEur: 0, description: '', field: '' });
      }
    } finally {
      setSavingProgram(false);
    }
  }

  async function handleDeleteProgram(id: string) {
    if (!confirm('Delete this program?')) return;
    await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    await fetchPrograms();
  }

  async function handleCommit(message: string) {
    setCommitting(true);
    try {
      const res = await fetch('/api/admin/commit', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Committed and pushed to GitHub!');
      } else {
        alert('Failed: ' + (data.error || data.details));
      }
    } catch {
      alert('Commit failed');
    } finally {
      setCommitting(false);
    }
  }

  function openEditUniversity(u: University) {
    setUniversityForm({
      id: u.id,
      name: u.name,
      city: u.city,
      country: u.country,
      logo: u.logo || '',
      website: u.website || '',
      coordinates: { lat: u.coordinates?.lat || 0, lng: u.coordinates?.lng || 0 },
    });
    setEditingUniversity(u);
  }

  function openEditProgram(p: Program) {
    setProgramForm({ ...p });
    setEditingProgram(p);
  }

  function getUniversityName(id: string) {
    return universities.find(u => u.id === id)?.name || id;
  }

  function getCountry(id: string) {
    return universities.find(u => u.id === id)?.country || '';
  }

  function getProgramCount(universityId: string) {
    return programs.filter(p => p.universityId === universityId).length;
  }

  const countries = Array.from(new Set(universities.map(u => u.country))).sort();
  const filteredPrograms = programs.filter(p => {
    if (filterUniversity !== 'all' && p.universityId !== filterUniversity) return false;
    if (filterCountry !== 'all' && getCountry(p.universityId) !== filterCountry) return false;
    if (filterLanguage !== 'all' && p.language !== filterLanguage) return false;
    return true;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="mb-6 text-center">
            <span className="text-3xl">🎓</span>
            <h1 className="mt-3 text-xl font-semibold text-slate-900">EuroUni Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Enter your admin password</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? 'Verifying...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-semibold text-slate-900">EuroUni</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('universities')}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'universities'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            🏛️ Universities
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'programs'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            📖 Programs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'settings'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="p-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-slate-600"
            onClick={() => { setAuthenticated(false); setPassword(''); }}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'universities' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Universities</h1>
                  <p className="text-sm text-slate-500 mt-0.5">{universities.length} universities in database</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCommit('Update from admin panel')}
                    disabled={committing}
                  >
                    {committing ? 'Pushing...' : '⟳ Push to GitHub'}
                  </Button>
                  <Button size="sm" onClick={() => setShowAddUniversity(true)}>
                    + Add University
                  </Button>
                </div>
              </div>

              {universitiesLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Programs</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {universities.map(u => (
                        <>
                          <TableRow key={u.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>
                            <TableCell className="w-8 text-center">
                              <span className="text-lg">{u.logo || '🏛️'}</span>
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">{u.name}</TableCell>
                            <TableCell className="text-slate-600">{u.city}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{u.country}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              <Badge variant="outline" className="text-xs">{getProgramCount(u.id)}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-500 text-xs max-w-32 truncate">
                              {u.website || '—'}
                            </TableCell>
                            <TableCell className="w-24" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => openEditUniversity(u)} className="h-7 px-2 text-xs">
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteUniversity(u.id)} className="h-7 px-2 text-xs text-red-500 hover:text-red-600">
                                  Del
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRow === u.id && (
                            <TableRow key={`${u.id}-expanded`} className="bg-slate-50">
                              <TableCell colSpan={7} className="p-4">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Coordinates</p>
                                    <p className="text-slate-700 font-mono">
                                      {u.coordinates?.lat?.toFixed(4) ?? '—'}, {u.coordinates?.lng?.toFixed(4) ?? '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Website</p>
                                    <p className="text-slate-700 font-mono text-xs">{u.website || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">ID</p>
                                    <p className="text-slate-700 font-mono text-xs">{u.id}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'programs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Programs</h1>
                  <p className="text-sm text-slate-500 mt-0.5">{filteredPrograms.length} of {programs.length} programs</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCommit('Update programs from admin')}
                    disabled={committing}
                  >
                    {committing ? 'Pushing...' : '⟳ Push to GitHub'}
                  </Button>
                  <Button size="sm" onClick={() => setShowAddProgram(true)}>
                    + Add Program
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <Select value={filterUniversity} onValueChange={setFilterUniversity}>
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue placeholder="Filter by university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="w-40 h-8 text-sm">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="slovak">Slovak</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="czech">Czech</SelectItem>
                    <SelectItem value="hungarian">Hungarian</SelectItem>
                  </SelectContent>
                </Select>
                {(filterUniversity !== 'all' || filterCountry !== 'all' || filterLanguage !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setFilterUniversity('all'); setFilterCountry('all'); setFilterLanguage('all'); }}
                    className="h-8 text-xs text-slate-500"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {programsLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Degree</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead className="text-right">Tuition (€)</TableHead>
                        <TableHead className="text-right">ECTS</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrograms.map(p => (
                        <>
                          <TableRow
                            key={p.id}
                            className="cursor-pointer hover:bg-slate-50"
                            onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                          >
                            <TableCell className="w-8 text-center text-lg">
                              {universities.find(u => u.id === p.universityId)?.logo || '🎓'}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">{p.name}</TableCell>
                            <TableCell className="text-slate-600 text-sm">
                              {getUniversityName(p.universityId)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={p.degree === 'bachelor' ? 'default' : 'secondary'}
                                className="text-xs capitalize"
                              >
                                {p.degree}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">{p.language}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-slate-600 text-sm">
                              {p.tuitionEur === 0 ? 'Free' : `€${p.tuitionEur.toLocaleString()}`}
                            </TableCell>
                            <TableCell className="text-right text-slate-600 text-sm">{p.ects}</TableCell>
                            <TableCell className="w-24" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => openEditProgram(p)} className="h-7 px-2 text-xs">
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteProgram(p.id)} className="h-7 px-2 text-xs text-red-500 hover:text-red-600">
                                  Del
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRow === p.id && (
                            <TableRow key={`${p.id}-expanded`} className="bg-slate-50">
                              <TableCell colSpan={8} className="p-4">
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Duration</p>
                                    <p className="text-slate-700">{p.durationMonths} months</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Field</p>
                                    <p className="text-slate-700">{p.field || '—'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</p>
                                    <p className="text-slate-700 line-clamp-2">{p.description || '—'}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-6">Settings</h1>
              <div className="max-w-xl space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="font-medium text-slate-900 mb-1">Data Source</h2>
                  <p className="text-sm text-slate-500 mb-4">Current data is stored in a local JSON file.</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-700">Universities</span>
                      <Badge variant="secondary">{universities.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-700">Programs</span>
                      <Badge variant="secondary">{programs.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-700">Data file</span>
                      <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">data/programs.json</code>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="font-medium text-slate-900 mb-1">Git Commit & Push</h2>
                  <p className="text-sm text-slate-500 mb-4">Save all changes and push to GitHub.</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Commit message (optional)"
                      className="flex-1"
                      value={commitMessage}
                      onChange={e => setCommitMessage(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        handleCommit(commitMessage || `Admin update: ${new Date().toLocaleDateString()}`);
                      }}
                      disabled={committing}
                    >
                      {committing ? 'Pushing...' : 'Commit & Push'}
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="font-medium text-slate-900 mb-1">Refresh Data</h2>
                  <p className="text-sm text-slate-500 mb-4">Reload all universities and programs from the data file.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchUniversities} disabled={universitiesLoading}>
                      Reload Universities
                    </Button>
                    <Button variant="outline" onClick={fetchPrograms} disabled={programsLoading}>
                      Reload Programs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit University Dialog */}
      <Dialog open={!!editingUniversity} onOpenChange={open => !open && setEditingUniversity(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit University</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input value={universityForm.name || ''} onChange={e => setUniversityForm(f => ({ ...f, name: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input value={universityForm.city || ''} onChange={e => setUniversityForm(f => ({ ...f, city: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={universityForm.country || ''} onChange={e => setUniversityForm(f => ({ ...f, country: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <Input value={universityForm.website || ''} onChange={e => setUniversityForm(f => ({ ...f, website: e.target.value }))} className="mt-1" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="any" value={universityForm.coordinates?.lat || ''} onChange={e => setUniversityForm(f => ({ ...f, coordinates: { ...f.coordinates!, lat: parseFloat(e.target.value) || 0 } }))} className="mt-1" />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="any" value={universityForm.coordinates?.lng || ''} onChange={e => setUniversityForm(f => ({ ...f, coordinates: { ...f.coordinates!, lng: parseFloat(e.target.value) || 0 } }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Logo (emoji)</Label>
              <Input value={universityForm.logo || ''} onChange={e => setUniversityForm(f => ({ ...f, logo: e.target.value }))} className="mt-1" placeholder="🎓" />
            </div>
            {editingUniversity && (
              <div>
                <Label className="text-xs text-slate-500">ID (read-only)</Label>
                <Input value={editingUniversity.id} disabled className="mt-1 bg-slate-50 text-xs font-mono" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUniversity(null)}>Cancel</Button>
            <Button onClick={handleSaveUniversity} disabled={savingUniversity}>
              {savingUniversity ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add University Dialog */}
      <Dialog open={showAddUniversity} onOpenChange={open => !open && setShowAddUniversity(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New University</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input value={addUniversityForm.name} onChange={e => setAddUniversityForm(f => ({ ...f, name: e.target.value }))} className="mt-1" placeholder="University name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input value={addUniversityForm.city} onChange={e => setAddUniversityForm(f => ({ ...f, city: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={addUniversityForm.country} onChange={e => setAddUniversityForm(f => ({ ...f, country: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <Input value={addUniversityForm.website} onChange={e => setAddUniversityForm(f => ({ ...f, website: e.target.value }))} className="mt-1" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="any" value={addUniversityForm.coordinates?.lat || ''} onChange={e => setAddUniversityForm(f => ({ ...f, coordinates: { ...f.coordinates!, lat: parseFloat(e.target.value) || 0 } }))} className="mt-1" />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="any" value={addUniversityForm.coordinates?.lng || ''} onChange={e => setAddUniversityForm(f => ({ ...f, coordinates: { ...f.coordinates!, lng: parseFloat(e.target.value) || 0 } }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Logo (emoji)</Label>
              <Input value={addUniversityForm.logo} onChange={e => setAddUniversityForm(f => ({ ...f, logo: e.target.value }))} className="mt-1" placeholder="🎓" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUniversity(false)}>Cancel</Button>
            <Button onClick={handleAddUniversity} disabled={savingUniversity || !addUniversityForm.name}>
              {savingUniversity ? 'Adding...' : 'Add University'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={!!editingProgram} onOpenChange={open => !open && setEditingProgram(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-96 overflow-y-auto">
            <div>
              <Label>Name</Label>
              <Input value={programForm.name || ''} onChange={e => setProgramForm(f => ({ ...f, name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>University</Label>
              <Select value={programForm.universityId || ''} onValueChange={v => setProgramForm(f => ({ ...f, universityId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Degree</Label>
                <Select value={programForm.degree || 'bachelor'} onValueChange={v => setProgramForm(f => ({ ...f, degree: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={programForm.language || 'english'} onValueChange={v => setProgramForm(f => ({ ...f, language: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="slovak">Slovak</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="czech">Czech</SelectItem>
                    <SelectItem value="hungarian">Hungarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>ECTS</Label>
                <Input type="number" value={programForm.ects || ''} onChange={e => setProgramForm(f => ({ ...f, ects: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label>Duration (months)</Label>
                <Input type="number" value={programForm.durationMonths || ''} onChange={e => setProgramForm(f => ({ ...f, durationMonths: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label>Tuition (€)</Label>
                <Input type="number" value={programForm.tuitionEur || ''} onChange={e => setProgramForm(f => ({ ...f, tuitionEur: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Field</Label>
              <Input value={programForm.field || ''} onChange={e => setProgramForm(f => ({ ...f, field: e.target.value }))} className="mt-1" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={programForm.description || ''} onChange={e => setProgramForm(f => ({ ...f, description: e.target.value }))} className="mt-1" placeholder="Program description" />
            </div>
            {editingProgram && (
              <div>
                <Label className="text-xs text-slate-500">ID (read-only)</Label>
                <Input value={editingProgram.id} disabled className="mt-1 bg-slate-50 text-xs font-mono" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProgram(null)}>Cancel</Button>
            <Button onClick={handleSaveProgram} disabled={savingProgram}>
              {savingProgram ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Program Dialog */}
      <Dialog open={showAddProgram} onOpenChange={open => !open && setShowAddProgram(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-96 overflow-y-auto">
            <div>
              <Label>Name</Label>
              <Input value={addProgramForm.name} onChange={e => setAddProgramForm(f => ({ ...f, name: e.target.value }))} className="mt-1" placeholder="Program name" />
            </div>
            <div>
              <Label>University</Label>
              <Select value={addProgramForm.universityId || ''} onValueChange={v => setAddProgramForm(f => ({ ...f, universityId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Degree</Label>
                <Select value={addProgramForm.degree || 'bachelor'} onValueChange={v => setAddProgramForm(f => ({ ...f, degree: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={addProgramForm.language || 'english'} onValueChange={v => setAddProgramForm(f => ({ ...f, language: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="slovak">Slovak</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="czech">Czech</SelectItem>
                    <SelectItem value="hungarian">Hungarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>ECTS</Label>
                <Input type="number" value={addProgramForm.ects || ''} onChange={e => setAddProgramForm(f => ({ ...f, ects: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label>Duration (months)</Label>
                <Input type="number" value={addProgramForm.durationMonths || ''} onChange={e => setAddProgramForm(f => ({ ...f, durationMonths: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label>Tuition (€)</Label>
                <Input type="number" value={addProgramForm.tuitionEur || ''} onChange={e => setAddProgramForm(f => ({ ...f, tuitionEur: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Field</Label>
              <Input value={addProgramForm.field || ''} onChange={e => setAddProgramForm(f => ({ ...f, field: e.target.value }))} className="mt-1" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={addProgramForm.description || ''} onChange={e => setAddProgramForm(f => ({ ...f, description: e.target.value }))} className="mt-1" placeholder="Program description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProgram(false)}>Cancel</Button>
            <Button onClick={handleAddProgram} disabled={savingProgram || !addProgramForm.name || !addProgramForm.universityId}>
              {savingProgram ? 'Adding...' : 'Add Program'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
