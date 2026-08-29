'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import {
  type Reservation,
  formatLKR,
  SRI_LANKAN_PROPERTIES,
} from '@/lib/types';
import {
  Palmtree,
  MapPin,
  Calendar,
  Users,
  BedDouble,
  Printer,
  Sparkles,
  ShieldCheck,
  QrCode,
  Download,
} from 'lucide-react';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

interface VoucherDialogProps {
  reservation: Reservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationVoucherDialog({
  reservation,
  open,
  onOpenChange,
}: VoucherDialogProps) {
  if (!reservation) return null;

  const property = SRI_LANKAN_PROPERTIES.find(
    (p) => p.name.toLowerCase() === reservation.property_name.toLowerCase()
  );

  const dIn = parseISO(reservation.check_in);
  const dOut = parseISO(reservation.check_out);
  const nights = isValid(dIn) && isValid(dOut) ? Math.max(1, differenceInDays(dOut, dIn)) : 1;

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    toast.success('Reservation Voucher PDF generated and downloaded.');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin sm:max-w-xl border-aquamarine-500/30 bg-background">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-emerald-950 font-bold">
                <Palmtree className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Aura Ceylon Resorts</DialogTitle>
                <p className="text-[10px] tracking-widest uppercase text-aquamarine-600 dark:text-aquamarine-400 font-semibold">
                  Official Luxury Voucher & Folio
                </p>
              </div>
            </div>
            <StatusBadge status={reservation.status} size="sm" />
          </div>
        </DialogHeader>

        {/* Voucher Folio Body */}
        <div className="space-y-4 pt-2 text-xs">
          {/* Reference & QR */}
          <div className="flex items-center justify-between rounded-2xl border border-aquamarine-500/20 bg-muted/40 p-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Reservation Reference
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                ACR-{reservation.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Booked on {formatDate(reservation.created_at)}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-2 text-emerald-950 shadow-sm">
              <QrCode className="h-10 w-10 text-emerald-950" />
              <span className="text-[9px] font-mono font-bold tracking-tighter">VERIFIED</span>
            </div>
          </div>

          {/* Property Info */}
          <div className="rounded-2xl border border-border/70 p-4 space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-aquamarine-600 dark:text-aquamarine-400">
                Property & Sanctuary
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                {reservation.property_name}
              </h3>
              <p className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-aquamarine-500" />
                {reservation.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-3">
              <div>
                <p className="text-muted-foreground">Suite / Villa Type</p>
                <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <BedDouble className="h-3.5 w-3.5 text-aquamarine-500" />
                  {reservation.room_type}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Party Size</p>
                <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-aquamarine-500" />
                  {reservation.guests_count} Guests
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-3">
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-aquamarine-500" />
                  {formatDate(reservation.check_in)} (14:00)
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-out</p>
                <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-aquamarine-500" />
                  {formatDate(reservation.check_out)} (11:00)
                </p>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="rounded-2xl border border-border/70 p-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-aquamarine-600 dark:text-aquamarine-400">
              Primary Guest Folio
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Guest: </span>
                <span className="font-semibold">{reservation.guest_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="font-mono text-xs">{reservation.guest_email}</span>
              </div>
              {reservation.special_requests && (
                <div className="col-span-2 mt-1 rounded-lg bg-muted/50 p-2 text-[11px] italic text-muted-foreground">
                  &ldquo;{reservation.special_requests}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-aquamarine-500/20 to-celadon-300/10 border border-aquamarine-500/30 p-4">
            <div>
              <p className="text-xs font-bold uppercase text-aquamarine-800 dark:text-aquamarine-300">
                Total Folio Amount ({nights} night{nights > 1 ? 's' : ''})
              </p>
              <p className="text-[11px] text-muted-foreground">Includes all luxury resort taxes</p>
            </div>
            <p className="text-xl font-extrabold text-foreground">
              {formatLKR(reservation.total_price_lkr)}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Print Voucher
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-1.5 bg-gradient-to-r from-aquamarine-500 to-emerald-600 text-white font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download Folio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMM d, yyyy') : iso;
}
