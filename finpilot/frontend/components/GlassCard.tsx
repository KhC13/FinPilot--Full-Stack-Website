import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  id?: string;
}

export default function GlassCard({ children, className = '', glow = false, id }: GlassCardProps) {
  return (
    <div
      id={id}
      className={`glass-card animate-fade-up ${glow ? 'shadow-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  eyebrow,
  title,
  description,
  icon
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 text-xl font-semibold text-ink md:text-2xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass">
          {icon}
        </div>
      )}
    </div>
  );
}
