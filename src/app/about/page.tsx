import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About EuroUni',
  description: 'EuroUni helps European high school graduates find the perfect university program. Learn about our mission, the student calculator, and how we cover 7 countries with 306 programs.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-7 h-7 text-primary"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
            <span className="text-xl font-bold text-slate-900">EuroUni</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link className="text-slate-600 hover:text-slate-900 transition-colors" href="/programs">Programs</Link>
            <Link className="text-slate-600 hover:text-slate-900 transition-colors" href="/universities">Universities</Link>
            <Link className="text-slate-600 hover:text-slate-900 transition-colors" href="/onboarding">Match Me</Link>
            <Link className="text-primary font-medium" href="/about">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            About EuroUni
          </h1>
          <p className="text-lg text-slate-500">
            Making European higher education accessible, one student at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Every year, thousands of European high school graduates face the same challenge: finding the right university program across borders. The information exists — but it's scattered across hundreds of websites, in different languages, with no easy way to compare.
          </p>
          <p className="text-slate-600 leading-relaxed">
            EuroUni was built to solve this. We aggregate and structure program data from universities across Europe — admission requirements, tuition costs,ECTS credits, language of instruction, duration — so you can find and compare programs in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { number: '306', label: 'Programs' },
            { number: '62', label: 'Universities' },
            { number: '7', label: 'Countries' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">How Our Student Calculator Works</h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Tell us about yourself',
                desc: 'Your GPA, math and science level, home location, language skills, and budget. Takes about 2 minutes.'
              },
              {
                step: '2',
                title: 'We score every program',
                desc: 'Our algorithm weighs academic fit, distance, language match, and cost to calculate a personalized match score for each program.'
              },
              {
                step: '3',
                title: 'You get ranked results',
                desc: 'Programs are ranked by your match score, with clear entry requirements and costs upfront — no hidden surprises.'
              },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries covered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Countries We Cover</h2>
          <p className="text-slate-500 text-sm mb-6">
            Currently covering 7 European countries with plans to expand:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Austria', 'Czech Republic', 'Germany', 'Hungary', 'Netherlands', 'Poland', 'Slovakia'].map(country => (
              <div key={country} className="flex items-center gap-2 text-slate-700 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {country}
              </div>
            ))}
          </div>
        </div>

        {/* Data freshness */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">How We Keep Data Up to Date</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            We update program data every academic year, starting each spring. Our sources include:
          </p>
          <ul className="text-slate-600 text-sm space-y-2">
            <li className="flex gap-2"><span className="text-primary">→</span> Direct university websites and program catalogs</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Official admission portals (national and university-level)</li>
            <li className="flex gap-2"><span className="text-primary">→</span> Published tuition schedules and scholarship information</li>
          </ul>
          <p className="text-slate-500 text-sm mt-4">
            Entry requirements shown are indicative. Always confirm with the university before applying.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Ready to find your match?</h2>
          <p className="text-primary-foreground/80 text-sm mb-6">
            Our student calculator takes 2 minutes and shows you programs tailored to your profile.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-white text-primary font-medium px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
          >
            Start Matching
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-white mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-4 h-4 text-primary-foreground"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
            </div>
            <span className="text-lg font-bold text-foreground">EuroUni</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 EuroUni. Helping European students find their path.</p>
        </div>
      </footer>
    </div>
  )
}
