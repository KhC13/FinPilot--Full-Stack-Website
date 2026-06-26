'use client';
import Navbar from '@/components/Navbar';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import { useFinancial } from '@/lib/FinancialContext';

export default function Page() {
  const { inputs } = useFinancial();
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <WhatIfSimulator inputs={inputs} />
      </div>
    </main>
  );
}