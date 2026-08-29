'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Loader2,
  CalendarDays,
  Users,
  Palmtree,
  MapPin,
  Gem,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  BedDouble,
  Info,
} from 'lucide-react';
import {
  SRI_LANKAN_PROPERTIES,
  type Property,
  type ReservationInsert,
  formatLKR,
} from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useReservations } from '@/hooks/use-reservations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { differenceInDays, parseISO, isValid, addDays, format } from 'date-fns';
import confetti from 'canvas-confetti';

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  defaultPropertyId?: string;
}

export function NewBookingDialog({
  open,
  onOpenChange,
  onCreated,
  defaultPropertyId,
}: NewBookingDialogProps) {
  const { user, profile } = useAuth();
  const { createReservation } = useReservations();
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    defaultPropertyId || SRI_LANKAN_PROPERTIES[0].id
  );
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [guestName, setGuestName] = useState(profile?.full_name || 'Chaminda Jayasinghe');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'chaminda.j@ceylonholdings.lk');
  
  // Default dates: tomorrow to +4 days
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const defaultCheckIn = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const defaultCheckOut = format(addDays(new Date(), 4), 'yyyy-MM-dd');

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState('');

  // Selected Property Object
  const selectedProperty: Property = useMemo(() => {
    return (
      SRI_LANKAN_PROPERTIES.find((p) => p.id === selectedPropertyId) ||
      SRI_LANKAN_PROPERTIES[0]
    );
  }, [selectedPropertyId]);

  // Sync default room type when property changes
  useEffect(() => {
    if (selectedProperty && (!selectedRoomType || !selectedProperty.roomTypes.includes(selectedRoomType))) {
      setSelectedRoomType(selectedProperty.roomTypes[0]);
    }
  }, [selectedProperty, selectedRoomType]);

  // Set default property if passed in prop
  useEffect(() => {
    if (defaultPropertyId) {
      setSelectedPropertyId(defaultPropertyId);
    }
  }, [defaultPropertyId]);

  // Calculate nights and pricing in LKR
  const { nights, baseSubtotal, serviceCharge, tourismLevy, grandTotal } = useMemo(() => {
    const dIn = parseISO(checkIn);
    const dOut = parseISO(checkOut);

    let n = 1;
    if (isValid(dIn) && isValid(dOut)) {
      const diff = differenceInDays(dOut, dIn);
      n = diff > 0 ? diff : 1;
    }

    const rate = selectedProperty.pricePerNightLkr;
    const base = rate * n;
    const service = Math.round(base * 0.10); // 10% luxury service fee
    const levy = Math.round(base * 0.025);   // 2.5% Sri Lanka tourism & environmental levy
    const total = base + service + levy;

    return {
      nights: n,
      baseSubtotal: base,
      serviceCharge: service,
      tourismLevy: levy,
      grandTotal: total,
    };
  }, [checkIn, checkOut, selectedProperty]);

  function triggerConfetti() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#66CDAA', '#ACE1AF', '#2d9173', '#FFD700', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error('Please specify check-in and check-out dates.');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    setLoading(true);
    try {
      const payload: ReservationInsert = {
        property_name: selectedProperty.name,
        location: selectedProperty.location,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: Number(guestsCount) || 2,
        room_type: selectedRoomType || selectedProperty.roomTypes[0],
        total_price_lkr: grandTotal,
        status: 'Confirmed',
        guest_name: guestName.trim() || 'Chaminda Jayasinghe',
        guest_email: guestEmail.trim() || 'guest@auraceylon.lk',
        special_requests: specialRequests.trim() || null,
      };

      const res = await createReservation(payload);
      if (res.success) {
        triggerConfetti();
        toast.success(`Reservation Confirmed! Welcome to ${selectedProperty.name}.`, {
          description: `${nights} night(s) · ${formatLKR(grandTotal)} · Reference: ${res.data?.id.slice(0, 8).toUpperCase()}`,
        });
        onOpenChange(false);
        onCreated?.();
      } else {
        throw new Error(res.error || 'Failed to complete reservation');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit reservation.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto scrollbar-thin sm:max-w-2xl border-aquamarine-500/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-aquamarine-600 dark:text-aquamarine-400">
            <Palmtree className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Aura Ceylon Sanctuary
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Reserve Your Luxury Stay
          </DialogTitle>
          <DialogDescription className="text-xs">
            Dynamic real-time Ceylon reservation and live price calculator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Villa / Property Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Select Villa or Sanctuary</span>
              <span className="text-aquamarine-600 dark:text-aquamarine-400 font-bold">
                {formatLKR(selectedProperty.pricePerNightLkr)} / night
              </span>
            </Label>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="h-12 border-border/80 bg-card/60">
                <SelectValue placeholder="Choose a Sri Lankan property" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {SRI_LANKAN_PROPERTIES.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="py-2.5">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="text-left">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-aquamarine-500" />
                          {p.location}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-aquamarine-600 dark:text-aquamarine-400 ml-auto whitespace-nowrap">
                        {formatLKR(p.pricePerNightLkr)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Type & Guest Count */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <BedDouble className="h-3.5 w-3.5 text-aquamarine-500" />
                Suite / Room Type
              </Label>
              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                <SelectTrigger className="h-10 bg-card/60">
                  <SelectValue placeholder="Select suite type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProperty.roomTypes.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-aquamarine-500" />
                Guests (Max: {selectedProperty.maxGuests})
              </Label>
              <Select
                value={String(guestsCount)}
                onValueChange={(val) => setGuestsCount(Number(val))}
              >
                <SelectTrigger className="h-10 bg-card/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedProperty.maxGuests }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} {num === 1 ? 'Guest' : 'Guests'} (Adults & Children)
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates Selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="check_in" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-aquamarine-500" />
                Check-in Date
              </Label>
              <Input
                id="check_in"
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (e.target.value >= checkOut) {
                    setCheckOut(format(addDays(parseISO(e.target.value), 1), 'yyyy-MM-dd'));
                  }
                }}
                className="bg-card/60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_out" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-aquamarine-500" />
                Check-out Date ({nights} {nights === 1 ? 'Night' : 'Nights'})
              </Label>
              <Input
                id="check_out"
                type="date"
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-card/60"
                required
              />
            </div>
          </div>

          {/* Guest Identity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest_name" className="text-xs font-semibold text-muted-foreground">
                Primary Guest Name
              </Label>
              <Input
                id="guest_name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Chaminda Jayasinghe"
                className="bg-card/60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest_email" className="text-xs font-semibold text-muted-foreground">
                Confirmation Email
              </Label>
              <Input
                id="guest_email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="e.g. guest@ceylonholdings.lk"
                className="bg-card/60"
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special_requests" className="text-xs font-semibold text-muted-foreground">
              Special Sanctuary Requests (Optional)
            </Label>
            <Textarea
              id="special_requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Airport luxury transfer, romantic candlelight dinner, Ayurveda massage session, extra plush pillows..."
              rows={2}
              className="bg-card/60 text-sm"
            />
          </div>

          {/* Live Dynamic Price Breakdown Box */}
          <div className="rounded-2xl border border-aquamarine-500/30 bg-gradient-to-br from-aquamarine-500/10 via-celadon-300/5 to-transparent p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-aquamarine-700 dark:text-aquamarine-300">
              <span className="flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" />
                Live Price Breakdown
              </span>
              <span>{nights} Night{nights > 1 ? 's' : ''} Stay</span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{formatLKR(selectedProperty.pricePerNightLkr)} × {nights} night(s)</span>
                <span className="font-medium text-foreground">{formatLKR(baseSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Resort Service Charge (10%)
                </span>
                <span className="font-medium text-foreground">{formatLKR(serviceCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span>SL Tourism Development Levy (2.5%)</span>
                <span className="font-medium text-foreground">{formatLKR(tourismLevy)}</span>
              </div>
            </div>

            <div className="border-t border-aquamarine-500/20 pt-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Payable (LKR)
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-aquamarine-500" />
                  Includes all luxury taxes & services
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-aquamarine-700 dark:text-aquamarine-300 tracking-tight">
                  {formatLKR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-md shadow-aquamarine-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming Reservation...
                </>
              ) : (
                <>
                  <Gem className="mr-2 h-4 w-4" />
                  Confirm Reservation ({formatLKR(grandTotal)})
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
