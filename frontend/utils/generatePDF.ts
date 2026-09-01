import { jsPDF } from 'jspdf';
import type { FinancialFormValues } from '@/components/FinancialScoreCard';
import type { ScoreResponse, FutureCostResponse, InvestmentResponse, Insight } from '@/lib/api';

/**
 * Everything DownloadReportButton needs to hand off to build the PDF.
 * futureCost / investment / insights are optional so the report still
 * renders something useful even if a caller only has the score handy.
 */
export interface FinancialReportData {
  inputs: FinancialFormValues;
  score: ScoreResponse;
  futureCost?: FutureCostResponse | null;
  investment?: InvestmentResponse | null;
  insights?: Insight[];
}

// Brand palette, as RGB tuples (jsPDF's fill/text color APIs take 0-255 RGB,
// not hex/Tailwind tokens, so these are duplicated from tailwind.config.ts
// rather than imported).
const COLOR = {
  purple: [139, 92, 246] as const,
  cyan: [34, 211, 238] as const,
  ink: [22, 24, 38] as const,
  inkMuted: [110, 118, 138] as const,
  border: [225, 227, 235] as const,
  panel: [246, 247, 251] as const,
  success: [16, 150, 110] as const,
  warning: [180, 120, 10] as const,
  danger: [210, 60, 60] as const
};

const toneColor: Record<ScoreResponse['tone'], readonly [number, number, number]> = {
  success: COLOR.success,
  warning: COLOR.warning,
  danger: COLOR.danger
};

const severityColor: Record<Insight['type'], readonly [number, number, number]> = {
  positive: COLOR.success,
  alert: COLOR.warning,
  warning: COLOR.warning,
  risk: COLOR.danger
};

/**
 * Plain-grouping currency formatter for PDF text.
 *
 * Deliberately NOT reusing lib/format.ts's formatCurrency(): that helper
 * outputs the "₹" glyph via Intl's currency style, which standard jsPDF
 * fonts (Helvetica/WinAnsi) cannot render — it prints as a broken box
 * character. Using an ASCII "Rs." prefix keeps the PDF text layer clean
 * and copy-pasteable.
 */
function rs(value: number): string {
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value || 0));
  return `Rs. ${formatted}`;
}

export function generateFinancialReportPDF(data: FinancialReportData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = 0;

  // ---------- Header band ----------
  doc.setFillColor(...COLOR.purple);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text('FinPilot Financial Report', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Your Financial Co-Pilot', margin, 22);

  const generatedOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  doc.text(`Generated ${generatedOn}`, pageWidth - margin, 22, { align: 'right' });

  y = 42;

  // ---------- Score snapshot ----------
  y = sectionTitle(doc, 'Financial Health Score', y, margin);

  const tone = toneColor[data.score.tone];
  doc.setFillColor(...tone);
  doc.roundedRect(margin, y, 56, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${data.score.score}`, margin + 8, y + 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('/ 100', margin + 8 + doc.getTextWidth(`${data.score.score} `), y + 12);
  doc.setFontSize(9);
  doc.text(data.score.label, margin + 8, y + 17);

  doc.setTextColor(...COLOR.inkMuted);
  doc.setFontSize(9);
  const metricsX = margin + 64;
  doc.text(`Savings rate: ${data.score.metrics.savingsRate}%`, metricsX, y + 6);
  doc.text(`Expense ratio: ${data.score.metrics.expenseRatio}%`, metricsX, y + 12);
  doc.text(`Debt / income: ${data.score.metrics.debtToIncome}%`, metricsX, y + 18);

  y += 28;

  // ---------- Income / Expenses / Savings / Debt ----------
  y = sectionTitle(doc, 'Income, Expenses & Debt', y, margin);
  y = statGrid(
    doc,
    [
      { label: 'Monthly income', value: rs(data.inputs.income) },
      { label: 'Monthly expenses', value: rs(data.inputs.expenses) },
      { label: 'Current savings', value: rs(data.inputs.savings) },
      { label: 'Total debt', value: rs(data.inputs.debt) }
    ],
    y,
    margin,
    contentWidth
  );

  // ---------- Future cost summary ----------
  if (data.futureCost) {
    y = ensureSpace(doc, y, 46, pageHeight, margin);
    y = sectionTitle(doc, 'Future Cost Summary', y, margin);
    y = statGrid(
      doc,
      [
        { label: 'Present cost', value: rs(data.futureCost.summary.presentCost) },
        { label: `Future cost (${data.futureCost.summary.years} yrs)`, value: rs(data.futureCost.summary.futureCost) },
        { label: 'Total increase', value: rs(data.futureCost.summary.totalIncrease) },
        { label: 'Inflation rate assumed', value: `${data.futureCost.summary.inflationRate}% / yr` }
      ],
      y,
      margin,
      contentWidth
    );
  }

  // ---------- Investment plan ----------
  if (data.investment) {
    y = ensureSpace(doc, y, 46, pageHeight, margin);
    y = sectionTitle(doc, 'Investment Plan', y, margin);
    y = statGrid(
      doc,
      [
        { label: 'Invest daily', value: rs(data.investment.plan.dailyInvestment) },
        { label: 'Invest monthly', value: rs(data.investment.plan.monthlyInvestment) },
        { label: 'Round-off savings / month', value: rs(data.investment.plan.monthlyRoundOffSavings) },
        { label: 'Round-off savings / year', value: rs(data.investment.plan.yearlyRoundOffSavings) }
      ],
      y,
      margin,
      contentWidth
    );
  }

  // ---------- Insights ----------
  if (data.insights && data.insights.length > 0) {
    y = ensureSpace(doc, y, 24, pageHeight, margin);
    y = sectionTitle(doc, 'Smart Insights', y, margin);

    for (const insight of data.insights) {
      const messageLines = doc.splitTextToSize(insight.message, contentWidth - 8);
      const blockHeight = 6 + messageLines.length * 4.2 + 4;
      y = ensureSpace(doc, y, blockHeight, pageHeight, margin);

      doc.setFillColor(...severityColor[insight.type]);
      doc.circle(margin + 1.5, y - 1, 1.3, 'F');

      doc.setTextColor(...COLOR.ink);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(insight.title, margin + 6, y);

      doc.setTextColor(...COLOR.inkMuted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(messageLines, margin + 6, y + 4.8);

      y += blockHeight;
    }
  }

  // ---------- Footer (disclaimer + page numbers) on every page ----------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...COLOR.border);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setTextColor(...COLOR.inkMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Demo report generated by FinPilot. Not financial advice.', margin, pageHeight - 9);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }

  const fileStamp = new Date().toISOString().slice(0, 10);
  doc.save(`FinPilot-Report-${fileStamp}.pdf`);
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function sectionTitle(doc: jsPDF, title: string, y: number, margin: number): number {
  doc.setFillColor(...COLOR.purple);
  doc.rect(margin, y - 3.2, 3, 3, 'F');
  doc.setTextColor(...COLOR.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title, margin + 6, y);
  return y + 8;
}

function statGrid(
  doc: jsPDF,
  items: { label: string; value: string }[],
  y: number,
  margin: number,
  contentWidth: number
): number {
  const gap = 4;
  const colWidth = (contentWidth - gap) / 2;
  const rowHeight = 15;

  items.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (colWidth + gap);
    const rowY = y + row * (rowHeight + gap);

    doc.setFillColor(...COLOR.panel);
    doc.setDrawColor(...COLOR.border);
    doc.roundedRect(x, rowY, colWidth, rowHeight, 2.5, 2.5, 'FD');

    doc.setTextColor(...COLOR.inkMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.label, x + 4, rowY + 5.5);

    doc.setTextColor(...COLOR.ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(item.value, x + 4, rowY + 11.5);
  });

  const rows = Math.ceil(items.length / 2);
  return y + rows * (rowHeight + gap) + 4;
}

function ensureSpace(doc: jsPDF, y: number, needed: number, pageHeight: number, margin: number): number {
  if (y + needed > pageHeight - 18) {
    doc.addPage();
    return margin + 10;
  }
  return y;
}