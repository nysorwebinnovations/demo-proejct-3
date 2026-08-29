'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Users,
  MapPin,
  FileText,
  Loader2,
  Palmtree,
  MoreVertical,
  Download,
  XCircle,
  CheckCircle,
  Building,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { useAuth } from '@/components/providers/auth-provider';
import { useReservations } from '@/hooks/use-reservations';
import {
  RESERVATION_STATUSES,
  SRI_LANKAN_PROPERTIES,
  type Reservation,
  type ReservationStatus,
  formatLKR,
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { NewBookingDialog } from '@/components/dashboard/new-booking-dialog';
import { ReservationVoucherDialog } from '@/components/reservation/reservation-voucher-dialog';

export default function BookingsPage() {
  const { role, user } = useAuth();
  const { reservations, loading, error, refetch, updateStatus } = useReservations(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Reservation | null>(null);
  const [voucherOpen, setVoucherOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.guest_name.toLowerCase().includes(q) ||
        r.guest_email.toLowerCase().includes(q) ||
        r.property_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.special_requests ?? '').toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || r.status === statusFilter;

      const matchesProperty =
        propertyFilter === 'all' || r.property_name === propertyFilter;

      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [reservations, search, statusFilter, propertyFilter]);

  async function handleStatusChange(reservation: Reservation, newStatus: ReservationStatus) {
    if (reservation.status === newStatus) return;
    setUpdatingId(reservation.id);
    try {
      const res = await updateStatus(reservation.id, newStatus);
      if (res.success) {
        toast.success(`Reservation status updated to "${newStatus}".`);
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update reservation status.'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleOpenVoucher(r: Reservation) {
    setSelectedVoucher(r);
    setVoucherOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Reservations Ledger
            </h1>
            <Badge
              variant="outline"
              className="border-aquamarine-400/40 bg-aquamarine-400/10 text-aquamarine-700 dark:text-aquamarine-300 text-xs font-semibold"
            >
              {filtered.length} Folios
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {role === 'admin'
              ? 'Complete luxury resort reservation registry and inventory manager.'
              : 'View, print vouchers, or update your Sri Lankan villa reservations.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-border/80"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Reservation
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="rounded-3xl border-border/70 bg-card/90 backdrop-blur-md shadow-sm">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">All Stays & Invoices</CardTitle>
              <CardDescription>
                Showing {filtered.length} of {reservations.length} total Ceylon bookings
              </CardDescription>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search guest, villa, email, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 sm:w-64 rounded-xl bg-card/60"
                />
              </div>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 rounded-xl bg-card/60">
                  <Filter className="mr-1.5 h-3.5 w-3.5 text-aquamarine-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {RESERVATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property filter */}
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-full sm:w-52 rounded-xl bg-card/60">
                  <Palmtree className="mr-1.5 h-3.5 w-3.5 text-aquamarine-500" />
                  <SelectValue placeholder="Sanctuary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sanctuaries</SelectItem>
                  {SRI_LANKAN_PROPERTIES.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyTable
              onAction={() => setDialogOpen(true)}
              hasFilters={!!search || statusFilter !== 'all' || propertyFilter !== 'all'}
            />
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="font-bold text-foreground">Sanctuary & Suite</TableHead>
                    <TableHead className="font-bold text-foreground">Primary Guest</TableHead>
                    <TableHead className="font-bold text-foreground">Stay Dates</TableHead>
                    <TableHead className="font-bold text-foreground">Total (LKR)</TableHead>
                    <TableHead className="font-bold text-foreground">Status</TableHead>
                    <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const dIn = parseISO(r.check_in);
                    const dOut = parseISO(r.check_out);
                    const nights =
                      isValid(dIn) && isValid(dOut)
                        ? Math.max(1, differenceInDays(dOut, dIn))
                        : 1;

                    return (
                      <TableRow key={r.id} className="border-border/50 hover:bg-muted/40 transition-colors">
                        {/* Property & Room Type */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-bold text-sm text-foreground block">
                              {r.property_name}
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              {r.room_type}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-aquamarine-600 dark:text-aquamarine-400">
                              <MapPin className="h-3 w-3" />
                              {r.location}
                            </span>
                          </div>
                        </TableCell>

                        {/* Guest Details */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              {r.guest_name}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground block">
                              {r.guest_email}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Users className="h-3 w-3 text-aquamarine-500" />
                              {r.guests_count} Guest{r.guests_count > 1 ? 's' : ''}
                            </span>
                          </div>
                        </TableCell>

                        {/* Stay Dates */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <Calendar className="h-3.5 w-3.5 text-aquamarine-500" />
                              <span>{formatDate(r.check_in)}</span>
                              <span>→</span>
                              <span>{formatDate(r.check_out)}</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground block">
                              {nights} night{nights > 1 ? 's' : ''} stay
                            </span>
                          </div>
                        </TableCell>

                        {/* Total Price */}
                        <TableCell>
                          <span className="text-sm font-extrabold text-foreground tracking-tight">
                            {formatLKR(r.total_price_lkr)}
                          </span>
                        </TableCell>

                        {/* Status (Admin Selector or Guest Badge) */}
                        <TableCell>
                          {role === 'admin' ? (
                            <Select
                              value={r.status}
                              onValueChange={(val) => handleStatusChange(r, val as ReservationStatus)}
                              disabled={updatingId === r.id}
                            >
                              <SelectTrigger className="h-8 w-[155px] text-xs rounded-lg border-border/80">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {RESERVATION_STATUSES.map((st) => (
                                  <SelectItem key={st} value={st} className="text-xs">
                                    {st}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <StatusBadge status={r.status} size="sm" />
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenVoucher(r)}
                              className="h-8 rounded-lg text-xs gap-1 border-border/80 hover:bg-muted"
                            >
                              <FileText className="h-3.5 w-3.5 text-aquamarine-500" />
                              Voucher
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl text-xs">
                                <DropdownMenuLabel>Reservation Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenVoucher(r)} className="gap-2">
                                  <FileText className="h-3.5 w-3.5 text-aquamarine-500" />
                                  View Folio Voucher
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {r.status !== 'Confirmed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(r, 'Confirmed')}
                                    className="gap-2 text-emerald-600"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                )}
                                {r.status !== 'Cancelled' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(r, 'Cancelled')}
                                    className="gap-2 text-rose-600"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Cancel Reservation
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NewBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={refetch}
      />

      <ReservationVoucherDialog
        reservation={selectedVoucher}
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
      />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function EmptyTable({
  onAction,
  hasFilters,
}: {
  onAction: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aquamarine-500/15 text-aquamarine-700 dark:text-aquamarine-300">
        <Palmtree className="h-6 w-6" />
      </div>
      <div>
        <p className="text-base font-bold text-foreground">
          {hasFilters ? 'No matching Ceylon reservations' : 'No reservations logged'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {hasFilters
            ? 'Try adjusting your search criteria or filter selections.'
            : 'Create your first luxury stay reservation to see it listed here.'}
        </p>
      </div>
      {!hasFilters && (
        <Button
          size="sm"
          onClick={onAction}
          className="mt-2 rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 text-white font-semibold"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Reserve Sanctuary
        </Button>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMM d, yyyy') : iso;
}
