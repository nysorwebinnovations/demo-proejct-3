'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInAsDemo: (role?: 'guest' | 'admin') => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_GUEST_USER: User = {
  id: 'guest-usr-01',
  app_metadata: {},
  user_metadata: { full_name: 'Chaminda Jayasinghe' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'chaminda.j@ceylonholdings.lk',
  phone: '+94 77 123 4567',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const DEMO_GUEST_PROFILE: Profile = {
  id: 'guest-usr-01',
  email: 'chaminda.j@ceylonholdings.lk',
  full_name: 'Chaminda Jayasinghe',
  role: 'guest',
  phone: '+94 77 123 4567',
  created_at: new Date().toISOString(),
};

const DEMO_ADMIN_USER: User = {
  id: 'admin-usr-01',
  app_metadata: {},
  user_metadata: { full_name: 'Resort General Manager' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'concierge@auraceylon.lk',
  phone: '+94 11 987 6543',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const DEMO_ADMIN_PROFILE: Profile = {
  id: 'admin-usr-01',
  email: 'concierge@auraceylon.lk',
  full_name: 'Resort Concierge & Manager',
  role: 'admin',
  phone: '+94 11 987 6543',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.warn('Profile fetch note:', error.message);
        return;
      }
      if (data) {
        setProfile(data as Profile);
      }
    } catch (e) {
      console.warn('Profile fetch exception', e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Check localStorage for demo mock session if any
    const savedDemoRole = typeof window !== 'undefined' ? localStorage.getItem('aura_demo_role') : null;

    if (!isSupabaseConfigured) {
      if (savedDemoRole === 'admin') {
        setUser(DEMO_ADMIN_USER);
        setProfile(DEMO_ADMIN_PROFILE);
      } else {
        // Default to luxury guest for seamless exploration
        setUser(DEMO_GUEST_USER);
        setProfile(DEMO_GUEST_PROFILE);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        fetchProfile(data.session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        // If not logged in, check if user requested demo mode
        if (savedDemoRole === 'admin') {
          setUser(DEMO_ADMIN_USER);
          setProfile(DEMO_ADMIN_PROFILE);
        } else if (savedDemoRole === 'guest') {
          setUser(DEMO_GUEST_USER);
          setProfile(DEMO_GUEST_PROFILE);
        }
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        (async () => {
          await fetchProfile(newSession.user.id);
          if (mounted) setLoading(false);
        })();
      } else {
        setProfile(null);
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_demo_role');
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out notice', e);
      }
    }
    setProfile(null);
    setUser(null);
    setSession(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signInAsDemo = useCallback((role: 'guest' | 'admin' = 'guest') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_demo_role', role);
    }
    if (role === 'admin') {
      setUser(DEMO_ADMIN_USER);
      setProfile(DEMO_ADMIN_PROFILE);
    } else {
      setUser(DEMO_GUEST_USER);
      setProfile(DEMO_GUEST_PROFILE);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user || session?.user || null,
        profile,
        session,
        role: profile?.role ?? 'guest',
        loading,
        configured: isSupabaseConfigured,
        signOut,
        refreshProfile,
        signInAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
