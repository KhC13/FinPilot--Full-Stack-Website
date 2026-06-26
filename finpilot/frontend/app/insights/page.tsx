'use client';
import Navbar from '@/components/Navbar';
import SmartInsights from '@/components/SmartInsights';
import { useFinancial } from '@/lib/FinancialContext';

export default function Page() {
  const { inputs } = useFinancial();
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <SmartInsights inputs={inputs} />
      </div>
    </main>
  );
}