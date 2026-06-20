import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800']
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600']
});

export const metadata: Metadata = {
  title: 'FinPilot — Your Financial Co-Pilot',
  description:
    'FinPilot helps you understand your financial health, plan for future costs, and build smart investment habits — all in one premium dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden">
        {/* Ambient floating gradient orbs */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] animate-float rounded-full bg-accent-purple/20 blur-[110px]" />
          <div
            className="absolute -right-24 top-1/3 h-[380px] w-[380px] animate-float rounded-full bg-accent-cyan/15 blur-[120px]"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-[320px] w-[320px] animate-float rounded-full bg-accent-blue/15 blur-[110px]"
            style={{ animationDelay: '4s' }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
