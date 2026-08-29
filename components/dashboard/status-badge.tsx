'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReservationStatus } from '@/lib/types';
import { CheckCircle2, Clock, CheckCheck, XCircle } from 'lucide-react';

const statusConfig: Record<
  ReservationStatus,
  { label: string; className: string; dot: string; icon: typeof CheckCircle2 }
> = {
  Confirmed: {
    label: 'Confirmed',
    className: 'border-aquamarine-400/40 bg-aquamarine-500/15 text-aquamarine-700 dark:text-aquamarine-300 shadow-sm shadow-aquamarine-500/10',
    dot: 'bg-aquamarine-500 shadow-aquamarine-400/60 shadow-[0_0_8px]',
    icon: CheckCircle2,
  },
  'Pending Payment': {
    label: 'Pending Payment',
    className: 'border-amber-400/40 bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm shadow-amber-500/10',
    dot: 'bg-amber-500 shadow-amber-400/60 shadow-[0_0_8px]',
    icon: Clock,
  },
  Completed: {
    label: 'Completed',
    className: 'border-teal-400/40 bg-teal-500/15 text-teal-700 dark:text-teal-300 shadow-sm shadow-teal-500/10',
    dot: 'bg-teal-500 shadow-teal-400/60 shadow-[0_0_8px]',
    icon: CheckCheck,
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'border-rose-400/40 bg-rose-500/15 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10',
    dot: 'bg-rose-500 shadow-rose-400/60 shadow-[0_0_8px]',
    icon: XCircle,
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: {
  status: ReservationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}) {
  const normStatus = (
    statusConfig[status as ReservationStatus]
      ? status
      : status === 'Approved'
      ? 'Confirmed'
      : status === 'In Progress'
      ? 'Confirmed'
      : 'Confirmed'
  ) as ReservationStatus;

  const cfg = statusConfig[normStatus] || statusConfig.Confirmed;
  const Icon = cfg.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 font-medium transition-all backdrop-blur-sm',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        size === 'lg' && 'px-3 py-1.5 text-sm',
        cfg.className
      )}
    >
      <span className={cn('relative flex h-2 w-2')}>
        <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', cfg.dot)} />
        <span className={cn('relative inline-flex rounded-full h-2 w-2', cfg.dot)} />
      </span>
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />}
      <span>{cfg.label}</span>
    </Badge>
  );
}

export const statusConfigMap = statusConfig;
