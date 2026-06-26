'use client';

import { createContext, useContext, useState } from 'react';
import type { FinancialFormValues } from '@/components/FinancialScoreCard';

const defaultInputs: FinancialFormValues = {
  income: 80000,
  expenses: 45000,
  savings: 15000,
  debt: 120000
};

interface FinancialContextType {
  inputs: FinancialFormValues;
  setInputs: (v: FinancialFormValues) => void;
}

const FinancialContext = createContext<FinancialContextType>({
  inputs: defaultInputs,
  setInputs: () => {}
});

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<FinancialFormValues>(defaultInputs);
  return (
    <FinancialContext.Provider value={{ inputs, setInputs }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  return useContext(FinancialContext);
}