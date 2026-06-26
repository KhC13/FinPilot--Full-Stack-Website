'use client';
import Navbar from '@/components/Navbar';
import FinancialScoreCard from '@/components/FinancialScoreCard';
import { useFinancial } from '@/lib/FinancialContext';
import Link from 'next/dist/client/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Page() {
    
  const { inputs, setInputs } = useFinancial();
  return (
    <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/HS.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <FinancialScoreCard inputs={inputs} onChange={setInputs} />
      </div>
    <div className="mt-16 flex justify-between">
  <Link
    href="/"
    className="btn-secondary flex items-center gap-2"
  >
    <ArrowLeft className="h-4 w-4" />
    Home
  </Link>

  <Link
    href="/what-if"
    className="btn-primary flex items-center gap-2"
  >
    Next: What-If
    <ArrowRight className="h-4 w-4" />
  </Link>
</div>  
    </main>
  );
}