'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Palmtree,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Calendar,
  Users,
  MapPin,
  FileText,
  BedDouble,
  Sparkles,
  Wallet,
  Building,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useReservations } from '@/hooks/use-reservations';
import { StatCard } from '@/components/dashboard/stat-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { NewBookingDialog } from '@/components/dashboard/new-booking-dialog';
import { ReservationVoucherDialog } from '@/components/reservation/reservation-voucher-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import {
  type Reservation,
  type ReservationStatus,
  formatLKR,
  SRI_LANKAN_PROPERTIES,
} from '@/lib/types';

const stageSteps: ReservationStatus[] = [
  'Pending Payment',
  'Confirmed',
  'Completed',
];

export default function DashboardPage() {
  const { user, profile, role } = useAuth();
  const { reservations, loading } = useReservations(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Reservation | null>(null);
  const [voucherOpen, setVoucherOpen] = useState(false);

  const stats = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter((r) => r.status === 'Confirmed').length;
    const pending = reservations.filter((r) => r.status === 'Pending Payment').length;
    const completed = reservations.filter((r) => r.status === 'Completed').length;
    const totalRevenueLkr = reservations
      .filter((r) => r.status !== 'Cancelled')
      .reduce((sum, r) => sum + Number(r.total_price_lkr || 0), 0);

    return { total, confirmed, pending, completed, totalRevenueLkr };
  }, [reservations]);

  const recent = useMemo(() => reservations.slice(0, 5), [reservations]);

  const activeReservations = useMemo(
    () =>
      reservations
        .filter((r) => r.status === 'Confirmed' || r.status === 'Pending Payment')
        .slice(0, 3),
    [reservations]
  );

  function handleOpenVoucher(res: Reservation) {
    setSelectedVoucher(res);
    setVoucherOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Ayubowan, {profile?.full_name || 'Valued Guest'}
            </h1>
            <Badge
              variant="outline"
              className="border-aquamarine-400/40 bg-aquamarine-400/10 text-aquamarine-700 dark:text-aquamarine-300 font-semibold"
            >
              {role === 'admin' ? 'Concierge & Admin' : 'Ceylon Privilege Member'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {role === 'admin'
              ? 'Overseeing guest stays, inventory folios, and real-time reservation statuses.'
              : 'Manage your Sri Lankan luxury villa stays, invoices, and itineraries.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-border/80 bg-card/60"
          >
            <Link href="/">
              <Compass className="mr-1.5 h-4 w-4 text-aquamarine-600 dark:text-aquamarine-400" />
              Explore Villas
            </Link>
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Reserve a Villa
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={role === 'admin' ? 'Total Portfolio Bookings' : 'Your Reservations'}
          value={loading ? '—' : stats.total}
          icon={CalendarCheck}
          tone="primary"
          hint={role === 'admin' ? 'Across all 8 Sanctuaries' : 'Lifetime stays'}
        />
        <StatCard
          label="Confirmed Stays"
          value={loading ? '—' : stats.confirmed}
          icon={ShieldCheck}
          tone="accent"
          hint="Guaranteed reservations"
          trend={`${stats.confirmed} Active`}
        />
        <StatCard
          label="Pending Payment"
          value={loading ? '—' : stats.pending}
          icon={Clock}
          tone="warning"
          hint="Awaiting final checkout"
        />
        <StatCard
          label={role === 'admin' ? 'Gross Ledger Value' : 'Completed Journeys'}
          value={
            loading
              ? '—'
              : role === 'admin'
              ? formatLKR(stats.totalRevenueLkr)
              : stats.completed
          }
          icon={role === 'admin' ? Wallet : CheckCircle2}
          tone="teal"
          hint={role === 'admin' ? 'Total confirmed volume' : 'Past Ceylon escapes'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Reservations Table/Card */}
        <Card className="lg:col-span-2 rounded-3xl border-border/70 bg-card/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Recent Reservations</CardTitle>
              <CardDescription>
                Your latest bookings and itinerary statuses
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/dashboard/bookings">
                View full ledger
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <ReservationsSkeleton />
            ) : recent.length === 0 ? (
              <EmptyReservationsState onAction={() => setDialogOpen(true)} />
            ) : (
              recent.map((r) => (
                <ReservationRow
                  key={r.id}
                  reservation={r}
                  onViewVoucher={() => handleOpenVoucher(r)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Live Reservation Stage Progress Tracker */}
        <Card className="rounded-3xl border-border/70 bg-card/90 backdrop-blur-md flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Journey Tracker</CardTitle>
              <span className="flex h-2 w-2 rounded-full bg-aquamarine-500 animate-pulse" />
            </div>
            <CardDescription>Live reservation lifecycle status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl bg-muted"
                  />
                ))}
              </div>
            ) : activeReservations.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground space-y-2">
                <Palmtree className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="text-sm font-medium">No upcoming active stays</p>
                <p className="text-xs">Book a luxury villa to begin your journey tracker.</p>
                <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)} className="mt-2">
                  Plan Stay
                </Button>
              </div>
            ) : (
              activeReservations.map((r) => (
                <TrackerItem
                  key={r.id}
                  reservation={r}
                  onViewVoucher={() => handleOpenVoucher(r)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Villa Spotlight Banner */}
      <div className="rounded-3xl border border-aquamarine-500/30 bg-gradient-to-r from-aquamarine-500/15 via-celadon-300/10 to-transparent p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge className="bg-aquamarine-500/80 text-emerald-950 font-bold border-none text-xs">
            Curated Sanctuary of the Month
          </Badge>
          <h3 className="text-2xl font-bold text-foreground">
            Ella Cloud Villa & Spa — Little Adams Peak
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Perched above the clouds overlooking Ella Rock. Features a heated private infinity pool, panoramic Ceylon tea verandahs, and bespoke Ayurvedic treatments.
          </p>
          <p className="text-sm font-extrabold text-foreground pt-1">
            Special Member Rate: {formatLKR(82000)} / night
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-2xl h-12 px-6 bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-bold shadow-md shrink-0"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Reserve Sanctuary
        </Button>
      </div>

      {/* Dialogs */}
      <NewBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <ReservationVoucherDialog
        reservation={selectedVoucher}
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
      />
    </div>
  );
}

function ReservationRow({
  reservation,
  onViewVoucher,
}: {
  reservation: Reservation;
  onViewVoucher: () => void;
}) {
  const dIn = parseISO(reservation.check_in);
  const dOut = parseISO(reservation.check_out);
  const nights = isValid(dIn) && isValid(dOut) ? Math.max(1, differenceInDays(dOut, dIn)) : 1;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border/60 p-4 transition-all hover:bg-muted/40 gap-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground truncate">
            {reservation.property_name}
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            · {reservation.room_type}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-aquamarine-500" />
            {reservation.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-aquamarine-500" />
            {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)} ({nights}n)
          </span>
          <span className="font-semibold text-foreground">
            {formatLKR(reservation.total_price_lkr)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between sm:justify-end">
        <StatusBadge status={reservation.status} size="sm" />
        <Button
          size="sm"
          variant="outline"
          onClick={onViewVoucher}
          className="h-8 rounded-lg text-xs gap-1 border-border/80"
        >
          <FileText className="h-3.5 w-3.5" />
          Folio
        </Button>
      </div>
    </div>
  );
}

function TrackerItem({
  reservation,
  onViewVoucher,
}: {
  reservation: Reservation;
  onViewVoucher: () => void;
}) {
  const isCancelled = reservation.status === 'Cancelled';
  const currentStageIndex = isCancelled
    ? -1
    : reservation.status === 'Completed'
    ? 2
    : reservation.status === 'Confirmed'
    ? 1
    : 0;

  return (
    <div className="rounded-2xl border border-border/60 p-4 space-y-3 bg-card/60">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <p className="truncate text-sm font-bold text-foreground">
            {reservation.property_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(reservation.check_in)} · {reservation.guest_name}
          </p>
        </div>
        <StatusBadge status={reservation.status} size="sm" showIcon={false} />
      </div>

      {/* 3-Step Progress Line */}
      {!isCancelled ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            {stageSteps.map((stage, i) => {
              const activeOrDone = i <= currentStageIndex;
              return (
                <div key={stage} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeOrDone
                        ? 'bg-gradient-to-r from-aquamarine-400 to-emerald-500 shadow-sm shadow-aquamarine-500/20'
                        : 'bg-muted'
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            {stageSteps.map((s, idx) => (
              <span
                key={s}
                className={idx === currentStageIndex ? 'font-bold text-foreground' : ''}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-rose-500 font-medium">Reservation Cancelled</p>
      )}

      <div className="pt-1 flex items-center justify-between text-xs">
        <span className="font-extrabold text-aquamarine-700 dark:text-aquamarine-300">
          {formatLKR(reservation.total_price_lkr)}
        </span>
        <button
          onClick={onViewVoucher}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          View Voucher
        </button>
      </div>
    </div>
  );
}

function ReservationsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function EmptyReservationsState({ onAction }: { onAction: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aquamarine-500/15 text-aquamarine-700 dark:text-aquamarine-300">
        <Palmtree className="h-6 w-6" />
      </div>
      <div>
        <p className="text-base font-bold text-foreground">No reservations yet</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a Sri Lankan villa to create your first luxury reservation.
        </p>
      </div>
      <Button
        size="sm"
        onClick={onAction}
        className="mt-2 rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 text-white font-semibold"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Reserve Sanctuary
      </Button>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMM d, yyyy') : iso;
}
