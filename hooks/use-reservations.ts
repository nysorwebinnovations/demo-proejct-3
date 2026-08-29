'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  INITIAL_MOCK_RESERVATIONS,
  type Reservation,
  type ReservationInsert,
  type ReservationStatus,
} from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';

const LOCAL_STORAGE_KEY = 'aura_ceylon_reservations_v1';

function getStoredReservations(): Reservation[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_RESERVATIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_RESERVATIONS));
      return INITIAL_MOCK_RESERVATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_RESERVATIONS;
  }
}

function saveStoredReservations(list: Reservation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

export function useReservations(enabled: boolean = true) {
  const { user, role } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Return localized mock state
      const local = getStoredReservations();
      // If user is guest, can view all mock demo or filter by user
      if (role === 'guest' && user?.id && !user.id.startsWith('guest-usr')) {
        const userOnly = local.filter((r) => r.user_id === user.id);
        setReservations(userOnly.length > 0 ? userOnly : local);
      } else {
        setReservations(local);
      }
      setLoading(false);
      return;
    }

    try {
      // First attempt query on 'reservations' table
      const { data, error: sbError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        // If table doesn't exist yet in user's Supabase project, try legacy bookings or fallback
        console.warn('Supabase reservations query returned:', sbError.message);
        
        // Attempt fallback to local storage
        const local = getStoredReservations();
        setReservations(local);
      } else {
        setReservations((data as Reservation[]) ?? []);
      }
    } catch (err) {
      console.warn('Failed to fetch reservations from Supabase, using local state', err);
      setReservations(getStoredReservations());
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (!enabled) return;
    fetchReservations();

    if (!isSupabaseConfigured) return;

    // Real-time channel listener
    const channel = supabase
      .channel('reservations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchReservations]);

  // Create new reservation
  const createReservation = async (data: ReservationInsert): Promise<{ success: boolean; data?: Reservation; error?: string }> => {
    const newReservation: Reservation = {
      id: 'res-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
      user_id: user?.id || 'guest-usr-01',
      property_name: data.property_name,
      location: data.location,
      check_in: data.check_in,
      check_out: data.check_out,
      guests_count: data.guests_count || 2,
      room_type: data.room_type,
      total_price_lkr: data.total_price_lkr,
      status: data.status || 'Confirmed',
      guest_name: data.guest_name || user?.user_metadata?.full_name || 'Valued Guest',
      guest_email: data.guest_email || user?.email || 'guest@auraceylon.lk',
      special_requests: data.special_requests || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Always update local storage for immediate responsiveness
    const current = getStoredReservations();
    const updated = [newReservation, ...current];
    saveStoredReservations(updated);
    setReservations(updated);

    if (isSupabaseConfigured) {
      try {
        const { error: insertErr } = await supabase.from('reservations').insert({
          property_name: newReservation.property_name,
          location: newReservation.location,
          check_in: newReservation.check_in,
          check_out: newReservation.check_out,
          guests_count: newReservation.guests_count,
          room_type: newReservation.room_type,
          total_price_lkr: newReservation.total_price_lkr,
          status: newReservation.status,
          guest_name: newReservation.guest_name,
          guest_email: newReservation.guest_email,
          special_requests: newReservation.special_requests,
        });

        if (insertErr) {
          console.warn('Supabase insert note (stored locally):', insertErr.message);
        }
      } catch (err) {
        console.warn('Supabase insert exception', err);
      }
    }

    return { success: true, data: newReservation };
  };

  // Update status (e.g. Admin Confirmed / Guest Cancelled)
  const updateStatus = async (id: string, newStatus: ReservationStatus): Promise<{ success: boolean; error?: string }> => {
    // Update local state first
    const current = getStoredReservations();
    const updated = current.map((r) =>
      r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r
    );
    saveStoredReservations(updated);
    setReservations(updated);

    if (isSupabaseConfigured) {
      try {
        const { error: updateErr } = await supabase
          .from('reservations')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (updateErr) {
          console.warn('Supabase status update note:', updateErr.message);
        }
      } catch (err) {
        console.warn('Supabase update status exception', err);
      }
    }

    return { success: true };
  };

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    createReservation,
    updateStatus,
  };
}

// Backwards compatibility alias
export const useBookings = useReservations;
