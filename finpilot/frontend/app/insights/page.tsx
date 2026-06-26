'use client';
import Navbar from '@/components/Navbar';
import SmartInsights from '@/components/SmartInsights';
import { useFinancial } from '@/lib/FinancialContext';
import Link from 'next/dist/client/link';

export default function Page() {
  const { inputs } = useFinancial();
  return (
    <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/insi.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <SmartInsights inputs={inputs} />
      </div>
    <div className="mt-16 flex justify-between">
  <Link href="/investment" className="btn-secondary">
    ← Investment
  </Link>

  <Link href="/" className="btn-primary">
    Home →
  </Link>
</div>  
    </main>
  );
}