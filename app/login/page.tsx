'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Palmtree,
  Gem,
  ShieldCheck,
  Crown,
  Compass,
  Star,
  MapPin,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SRI_LANKAN_PROPERTIES, formatLKR } from '@/lib/types';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { configured, user, loading: authLoading, signInAsDemo } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedVillaIndex, setSelectedVillaIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-cycle through featured villas every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedVillaIndex((prev) => (prev + 1) % SRI_LANKAN_PROPERTIES.slice(0, 3).length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      signInAsDemo('guest');
      toast.success('Signed in as Chaminda Jayasinghe (Demo Mode).');
      router.push('/dashboard');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success('Sanctuary account created. Welcome to Aura Ceylon.');
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Signed in to Aura Ceylon Portal.');
        router.push('/dashboard');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDemoLogin(role: 'guest' | 'admin') {
    signInAsDemo(role);
    toast.success(
      `Welcome! Signed in as ${
        role === 'admin' ? 'Resort Concierge / General Manager' : 'Chaminda Jayasinghe (Luxury Guest)'
      }`
    );
    router.push('/dashboard');
  }

  const featuredVillas = SRI_LANKAN_PROPERTIES.slice(0, 3);
  const activeVilla = featuredVillas[selectedVillaIndex];

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-aquamarine-400 selection:text-emerald-950">
      
      {/* Ambient background vector wave & radial glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-aquamarine-500/10 via-celadon-300/10 to-transparent blur-3xl animate-orb" />
        <div className="absolute bottom-10 right-10 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-3xl animate-orb-alt" />
      </div>

      {/* Top Floating Glass Header */}
      <header className="relative z-20 w-full px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-emerald-950 font-bold shadow-lg shadow-aquamarine-400/20">
              <Palmtree className="h-6 w-6 text-emerald-950" />
            </div>
            <div>
              <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
                Aura Ceylon
                <Badge
                  variant="outline"
                  className="border-aquamarine-500/40 bg-aquamarine-500/10 text-[10px] font-extrabold uppercase tracking-widest text-aquamarine-600 dark:text-aquamarine-300"
                >
                  Sanctuary
                </Badge>
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Luxury Villa &amp; Hotel Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl border-border/80 bg-card/60 backdrop-blur-md text-xs font-medium hover:bg-muted"
            >
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Website
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area — Modern Centered Vault Layout */}
      <main className="relative z-10 my-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div
            className={cn(
              'grid overflow-hidden rounded-[2.5rem] border border-aquamarine-500/20 bg-card/85 shadow-2xl backdrop-blur-2xl transition-all duration-700 lg:grid-cols-12',
              mounted ? 'animate-scale-in' : 'opacity-0'
            )}
          >
            {/* ═══════════════════════════════════════════════
                LEFT — Interactive Villa & Sanctuary Showcase (7 Cols)
            ════════════════════════════════════════════════ */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 p-8 text-sidebar-foreground lg:col-span-7 lg:p-12 border-b lg:border-b-0 lg:border-r border-sidebar-foreground/10">
              
              {/* Decorative radial overlay inside left panel */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-aquamarine-500/15 via-transparent to-celadon-300/10" />

              <div className="relative z-10 space-y-6">
                {/* Header Tagline */}
                <div className="inline-flex items-center gap-2 rounded-full border border-aquamarine-400/30 bg-sidebar-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-aquamarine-300 backdrop-blur-md">
                  <Gem className="h-3.5 w-3.5 text-aquamarine-400" />
                  <span>Sri Lanka&apos;s Signature Hospitality Ledger</span>
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-sidebar-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
                    Where Elegance Meets{' '}
                    <span className="bg-gradient-to-r from-aquamarine-400 via-celadon-300 to-aquamarine-300 bg-clip-text text-transparent">
                      Ceylon Serenity
                    </span>
                  </h1>
                  <p className="mt-3 text-sm text-sidebar-foreground/75 leading-relaxed max-w-lg">
                    Direct access to handpicked oceanfront pavilions, tea estate chalets, and heritage suites with real-time Sri Lankan Rupee pricing and automated guest vouchers.
                  </p>
                </div>

                {/* Interactive Villa Selector Tabs */}
                <div className="pt-2">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    <span>Featured Sanctuaries</span>
                    <span className="text-aquamarine-400">Live Availability</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {featuredVillas.map((villa, idx) => {
                      const isActive = selectedVillaIndex === idx;
                      return (
                        <button
                          key={villa.id}
                          type="button"
                          onClick={() => setSelectedVillaIndex(idx)}
                          className={cn(
                            'group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-300',
                            isActive
                              ? 'border-aquamarine-400/60 bg-sidebar-foreground/15 shadow-lg shadow-aquamarine-400/10'
                              : 'border-sidebar-foreground/10 bg-sidebar-foreground/5 hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/20'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-aquamarine-400">
                              0{idx + 1}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {villa.rating}
                            </div>
                          </div>
                          <p className="mt-2 line-clamp-1 text-xs font-bold text-sidebar-foreground">
                            {villa.name}
                          </p>
                          <p className="text-[10px] text-sidebar-foreground/60">
                            {villa.location.split(',')[0]}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Villa Spotlight Card */}
                <div className="rounded-2xl border border-aquamarine-400/30 bg-sidebar-foreground/10 p-5 backdrop-blur-md transition-all duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sidebar-foreground/10 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-sidebar-foreground">
                        {activeVilla.name}
                      </h3>
                      <p className="text-xs text-sidebar-foreground/65 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-aquamarine-400 shrink-0" />
                        {activeVilla.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-sidebar-foreground/50 uppercase tracking-wider block">
                        Rate / Night
                      </span>
                      <span className="text-base font-extrabold text-aquamarine-300">
                        {formatLKR(activeVilla.pricePerNightLkr)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-sidebar-foreground/75 leading-relaxed italic">
                    &ldquo;{activeVilla.tagline}&rdquo;
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                    {activeVilla.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 rounded-lg bg-aquamarine-400/15 px-2.5 py-1 text-[10px] font-semibold text-aquamarine-300"
                      >
                        <CheckCircle2 className="h-3 w-3 text-aquamarine-400" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="relative z-10 pt-6 border-t border-sidebar-foreground/10 flex flex-wrap items-center justify-between gap-3 text-xs text-sidebar-foreground/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-aquamarine-400" />
                  <span>Verified Ceylon Sanctuaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-aquamarine-400" />
                  <span>Real-time Concierge Ledger</span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                RIGHT — Modern Professional Auth Hub (5 Cols)
            ════════════════════════════════════════════════ */}
            <div className="flex flex-col justify-between p-8 lg:col-span-5 lg:p-10">
              
              <div className="space-y-6">
                {/* Header title */}
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {mode === 'signin' ? 'Sign In to Portal' : 'Create Sanctuary Account'}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mode === 'signin'
                      ? 'Access your guest itineraries, bookings, and folios.'
                      : 'Register for direct Sri Lankan Rupee member rates.'}
                  </p>
                </div>

                {/* Quick 1-Click Instant Demo Access Box */}
                <div className="rounded-2xl border border-aquamarine-500/30 bg-gradient-to-br from-aquamarine-500/10 via-celadon-300/5 to-transparent p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-aquamarine-700 dark:text-aquamarine-300 flex items-center gap-1.5">
                      <Gem className="h-3.5 w-3.5 text-aquamarine-500" />
                      Instant Demo Sign In
                    </span>
                    <Badge variant="outline" className="text-[10px] border-aquamarine-500/40 text-aquamarine-600 dark:text-aquamarine-400">
                      1-Click
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('guest')}
                      className="h-10 text-xs rounded-xl border-aquamarine-500/30 bg-card hover:bg-aquamarine-500/15 hover:text-aquamarine-700 dark:hover:text-aquamarine-300 hover:border-aquamarine-500/50 transition-all duration-200"
                    >
                      <User className="mr-1.5 h-3.5 w-3.5 text-aquamarine-600 dark:text-aquamarine-400" />
                      Chaminda J. (Guest)
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('admin')}
                      className="h-10 text-xs rounded-xl border-amber-500/30 bg-card hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-500/50 transition-all duration-200"
                    >
                      <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                      Resort Concierge
                    </Button>
                  </div>
                </div>

                {/* Segment Mode Switcher */}
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
                  {(['signin', 'signup'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        'rounded-xl py-2 text-xs font-bold transition-all duration-300',
                        mode === m
                          ? 'bg-background text-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {m === 'signin' ? 'Sign In' : 'New Member'}
                    </button>
                  ))}
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="e.g. Chaminda Jayasinghe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-11 rounded-xl bg-card/60"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="guest@ceylonholdings.lk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-card/60"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold">
                        Password
                      </Label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-aquamarine-600 dark:text-aquamarine-400 hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 rounded-xl bg-card/60"
                        required
                        minLength={6}
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-2xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-bold shadow-md shadow-aquamarine-500/20 transition-all duration-300 hover:scale-[1.01]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    {mode === 'signin' ? 'Sign In to Sanctuary' : 'Register Account'}
                  </Button>
                </form>
              </div>

              {/* Security & Footer Toggle */}
              <div className="mt-6 border-t border-border/50 pt-4 text-center text-xs text-muted-foreground">
                <p>
                  {mode === 'signin' ? 'New to Aura Ceylon? ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="font-bold text-aquamarine-600 dark:text-aquamarine-400 hover:underline"
                  >
                    {mode === 'signin' ? 'Create an account' : 'Sign in'}
                  </button>
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-aquamarine-500" />
                  <span>256-Bit SSL Encrypted Sanctuary Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Aura Ceylon Resorts &amp; Sanctuary Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Guest Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
