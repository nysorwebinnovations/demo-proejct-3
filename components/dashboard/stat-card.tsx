'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'primary' | 'accent' | 'warning' | 'success' | 'teal';
  hint?: string;
  trend?: string;
}

const toneClasses: Record<string, { bg: string; text: string; ring: string }> = {
  primary: {
    bg: 'bg-aquamarine-500/15 dark:bg-aquamarine-400/20',
    text: 'text-aquamarine-700 dark:text-aquamarine-300',
    ring: 'ring-aquamarine-500/30',
  },
  accent: {
    bg: 'bg-celadon-300/30 dark:bg-celadon-400/20',
    text: 'text-emerald-700 dark:text-celadon-300',
    ring: 'ring-celadon-400/30',
  },
  warning: {
    bg: 'bg-amber-500/15 dark:bg-amber-400/20',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-500/30',
  },
  success: {
    bg: 'bg-emerald-500/15 dark:bg-emerald-400/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-500/30',
  },
  teal: {
    bg: 'bg-teal-500/15 dark:bg-teal-400/20',
    text: 'text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-500/30',
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  hint,
  trend,
}: StatCardProps) {
  const currentTone = toneClasses[tone] || toneClasses.primary;

  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card/90 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-aquamarine-500/5 hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-aquamarine-400 to-celadon-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110',
            currentTone.bg,
            currentTone.text,
            currentTone.ring
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <span className="text-xs font-semibold text-aquamarine-600 dark:text-aquamarine-400">
                {trend}
              </span>
            )}
          </div>
          {hint && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
