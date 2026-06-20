'use client';

import { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number; // 0-100
  label: string;
  tone: 'success' | 'warning' | 'danger';
  size?: number;
}

const toneGlow: Record<ScoreRingProps['tone'], string> = {
  success: 'rgba(52,211,153,0.45)',
  warning: 'rgba(251,191,36,0.45)',
  danger: 'rgba(248,113,113,0.45)'
};

export default function ScoreRing({ score, label, tone, size = 220 }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const frame = useRef<number>();

  const stroke = size * 0.08;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const start = displayScore;
    const target = Math.max(0, Math.min(100, score));
    const duration = 900;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(start + (target - start) * eased));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const offset = circumference * (1 - displayScore / 100);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient pulsing glow behind the ring, tinted by health tone */}
      <div
        className="absolute inset-0 animate-pulse-glow rounded-full blur-2xl"
        style={{ backgroundColor: toneGlow[tone] }}
        aria-hidden
      />

      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.2s ease' }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="font-display text-5xl font-bold text-ink tabular-nums">{displayScore}</span>
        <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-ink-muted">out of 100</span>
        <span
          className={`mt-2 rounded-full border px-3 py-1 text-xs font-semibold ${
            tone === 'success'
              ? 'border-state-success/30 bg-state-success/10 text-state-success'
              : tone === 'warning'
              ? 'border-state-warning/30 bg-state-warning/10 text-state-warning'
              : 'border-state-danger/30 bg-state-danger/10 text-state-danger'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
