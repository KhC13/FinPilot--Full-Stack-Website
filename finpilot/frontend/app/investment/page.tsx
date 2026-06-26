import Navbar from '@/components/Navbar';
import InvestmentEngine from '@/components/InvestmentEngine';

export default function Page() {
  return (
    <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/invest.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <InvestmentEngine />
      </div>
    </main>
  );
}