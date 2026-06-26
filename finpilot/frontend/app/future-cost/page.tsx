import Navbar from '@/components/Navbar';
import FutureCostSimulator from '@/components/FutureCostSimulator';

export default function Page() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        <FutureCostSimulator />
      </div>
    </main>
  );
}