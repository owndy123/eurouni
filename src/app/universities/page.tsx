'use client';

import { useState } from 'react';
import { universities, programs, type University, type Program } from '@/lib/dataSource';

export default function UniversitiesPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Get unique countries
  const countries = Array.from(new Set(universities.map((u: University) => u.country))).sort();

  // Count programs per university
  const progCount: Record<string, number> = {};
  programs.forEach((p: Program) => {
    progCount[p.universityId] = (progCount[p.universityId] || 0) + 1;
  });

  // Filter universities
  const filtered = universities.filter((u: University) => {
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = !selectedCountry || u.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Group by country
  const byCountry: Record<string, University[]> = {};
  filtered.forEach((u: University) => {
    if (!byCountry[u.country]) byCountry[u.country] = [];
    byCountry[u.country].push(u);
  });

  // Country color map
  const countryColors: Record<string, string> = {
    'Austria': '#D40000',
    'Czech Republic': '#11457E',
    'Germany': '#DD0000',
    'Hungary': '#0056A4',
    'Netherlands': '#FF6600',
    'Poland': '#DC143C',
    'Slovakia': '#0B4EA2',
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-7 h-7 text-primary"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </a>
          <nav className="flex items-center gap-5 text-sm">
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="/programs">Programs</a>
            <a className="text-primary font-medium" href="/universities">Universities</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="/onboarding">Match Me</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Universities Across Europe
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              {universities.length} universities in {countries.length} countries
            </p>

            {/* Search */}
            <div className="relative mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              <input
                type="text"
                placeholder="Search universities, cities, or countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex w-full border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Country filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCountry(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !selectedCountry
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Countries
              </button>
              {countries.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c === selectedCountry ? null : c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCountry === c
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* University listings */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {Object.keys(byCountry).length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No universities match your search.</p>
            <button onClick={() => { setSearch(''); setSelectedCountry(null); }} className="mt-4 text-primary font-medium text-sm hover:underline">Clear filters</button>
          </div>
        )}

        {Object.keys(byCountry).sort().map((country) => (
          <div key={country} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: countryColors[country] || '#666' }}
              />
              <h2 className="text-lg font-semibold text-slate-900">{country}</h2>
              <span className="text-sm text-slate-400">{byCountry[country].length} universities</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {byCountry[country].sort((a: University, b: University) => a.name.localeCompare(b.name)).map((uni: University) => (
                <a
                  key={uni.id}
                  href={`/programs?university=${uni.id}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ backgroundColor: countryColors[country] || '#666' }}
                    >
                      {uni.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">{uni.city}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-primary">
                          {progCount[uni.id] || 0} programs
                        </span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
