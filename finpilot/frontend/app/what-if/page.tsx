'use client';
import Navbar from '@/components/Navbar';
import WhatIfSimulator from '@/components/WhatIfSimulator';
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
      backgroundImage: 'url(/comp.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <WhatIfSimulator inputs={inputs} />
      </div>   
   <div className="mt-16 flex justify-between">
  <Link href="/score" className="btn-secondary">
    ← Financial Score
  </Link>

  <Link href="/future-cost" className="btn-primary">
    Future Cost →
  </Link>
</div>    
    </main>
  );
}