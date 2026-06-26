'use client';

import Image from "next/image";
import Link from 'next/link';
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  TrendingUp,
  Wand2,
  BarChart3,
  Target,
  Brain,
  ArrowRight,
  ShieldCheck,
  Zap,
  LineChart
} from "lucide-react";
import { useFinancial } from '@/lib/FinancialContext';

const tools = [
  {
    href: '/score',
    icon: '/score.png',
    height: 40,
    width: 40,
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10 border-accent-cyan/20',
    title: 'Financial Health Score',
    desc: 'Enter your income, expenses, savings and debt. Get a 0–100 score with a breakdown of exactly what\'s dragging you down or lifting you up.'
  },
  {
    href: '/what-if',
    icon: '/compare.png',
    height: 40,
    width: 40,
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10 border-accent-purple/20',
    title: 'What-If Simulator',
    desc: 'Drag sliders to simulate boosting income, cutting expenses, or growing savings. Watch your score change live — no guesswork, just numbers.'
  },
  {
    href: '/future-cost',
    icon: '/cost.png',
    height: 40,
    width: 40,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10 border-accent-blue/20',
    title: 'Future Cost Simulator',
    desc: 'Pick any goal — house, car, education. See exactly what it will cost in 5, 10, or 20 years after inflation quietly inflates the price tag.'
  },
  {
    href: '/investment',
    icon: '/invest.png',
    height: 40,
    width: 40,
    color: 'text-state-success',
    bg: 'bg-state-success/10 border-state-success/20',
    title: 'Micro-Investment Engine',
    desc: 'Set a goal and a timeline. Get a daily and monthly investment amount so small it barely feels like saving — plus a round-off spare-change plan.'
  },
  {
    href: '/insights',
    icon: '/insights.png',
    height: 40,
    width: 40,
    color: 'text-state-warning',
    bg: 'bg-state-warning/10 border-accent-warning/20',
    title: 'Smart Insights',
    desc: 'Rule-based alerts that flag low savings, high debt risk, negative cash flow, and thin emergency cushions — refreshed every time you change a number.'
  }
];

const uniqueness: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Zap,
    title: 'Real-time, no submit button',
    desc: 'Every number you change instantly recalculates your score, chart, and plan. No waiting, no form submission.'
  },
  {
    icon: ShieldCheck,
    title: 'Your data stays local',
    desc: 'Nothing is stored on a server or tied to an account. Your financial numbers live only in your browser session.'
  },
  {
    icon: LineChart,
    title: 'Built on real finance math',
    desc: 'Savings rate, debt-to-income, emergency cushion, SIP compounding — every calculation uses the same formulas financial advisors use.'
  }
];

export default function LandingPage() {
  const { inputs } = useFinancial();

  return (
    <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/80" />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-glass-border bg-base-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="FinPilot logo" width={40} height={40} className="rounded-xl" />
            </Link>
            <div>
              <p className="font-display text-base font-bold leading-none text-ink">FinPilot</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-muted">Your Financial Co-Pilot</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 font-body text-sm font-medium text-ink-muted md:flex">
            <Link href="/score" className="transition-colors hover:text-ink">Health Score</Link>
            <Link href="/what-if" className="transition-colors hover:text-ink">What-If</Link>
            <Link href="/future-cost" className="transition-colors hover:text-ink">Future Cost</Link>
            <Link href="/investment" className="transition-colors hover:text-ink">Investments</Link>
            <Link href="/insights" className="transition-colors hover:text-ink">Insights</Link>
          </nav>
          <Link href="/score" className="btn-primary !px-4 !py-2 text-xs">Get Started</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center py-20 text-center md:py-28">
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] text-ink md:text-6xl">
            Plan smarter with your{' '}
            <span className="gradient-text">financial co-pilot</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            FinPilot reads your income, spending, and goals to score your financial health,
            project how inflation reshapes the future, and lay out an investment plan you
            can actually stick to.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/score" className="btn-primary gap-2 px-6 py-3 text-sm">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/score" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
              Learn more
              <ArrowRight className="ml-1 inline-block h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* ── What you'll learn ── */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">What you'll discover</p>
            <h2 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
              Five tools. One complete financial picture.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
              Each page answers a specific question about your money. Together they give you
              a 360° view — from where you stand today to where you'll be in 20 years.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ href, icon, color, bg, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="glass-card hover-lift group flex flex-col gap-4 p-6"
              >
                <div>
                  <Image
  src={icon}
  alt={title}
  width={40}
  height={40}
  className="object-contain"
/>
               </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink group-hover:gradient-text transition-all">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{desc}</p>
                </div>
                <div className={`mt-auto flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                  Open tool <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Why FinPilot ── */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">Why FinPilot</p>
            <h2 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
              Not another budgeting app
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
              No sign-up. No subscriptions. No ads. Just clean financial math that helps
              you think clearly about money.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {uniqueness.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-6 text-center">
                <div>
                  {typeof icon === "string" ? (
                    <Image
                      src={icon}
                      alt={title}
                      width={60}
                      height={50}
                      className="object-contain"
                    />
                  ) : (
                    (() => {
                      const Icon = icon;
                      return <Icon className="h-5 w-5" />;
                    })()
                 )}
               </div>
                <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="glass-card relative overflow-hidden p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-radial-glow opacity-60" />
          <p className="section-eyebrow relative">Ready to start?</p>
          <h2 className="relative mt-2 text-2xl font-bold text-ink md:text-4xl">
            Know your financial score in{' '}
            <span className="gradient-text">under 60 seconds</span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
            Enter 4 numbers. Get your score, a future cost projection, an investment plan, and personalised insights — instantly.
          </p>
          <Link href="/score" className="btn-primary relative mt-6 inline-flex px-8 py-3 text-sm">
            Check my financial health
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 flex flex-col items-center gap-2 border-t border-glass-border pt-8 text-center">
          <p className="font-display text-sm font-semibold text-ink">FinPilot</p>
          <p className="text-xs text-ink-muted">Built as a demo financial co-pilot. Not financial advice.</p>
        </footer>

      </div>
    </main>
  );
}