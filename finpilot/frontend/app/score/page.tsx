'use client';
import Navbar from '@/components/Navbar';
import FinancialScoreCard from '@/components/FinancialScoreCard';
import { useFinancial } from '@/lib/FinancialContext';

export default function Page() {
    
  const { inputs, setInputs } = useFinancial();
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <FinancialScoreCard inputs={inputs} onChange={setInputs} />
      </div>
    </main>
  );
}