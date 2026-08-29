'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Palmtree,
  ArrowRight,
  Gem,
  MapPin,
  Calendar,
  Users,
  Star,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Coffee,
  Waves,
  Sun,
  Crown,
  Search,
  Menu,
  Mail,
  Phone,
  Globe2,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useAuth } from '@/components/providers/auth-provider';
import { VillaExplorer } from '@/components/explorer/villa-explorer';
import { NewBookingDialog } from '@/components/dashboard/new-booking-dialog';
import { SRI_LANKAN_PROPERTIES, formatLKR } from '@/lib/types';

export default function HomePage() {
  const { user } = useAuth();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleOpenBooking(propertyId?: string) {
    setSelectedPropertyId(propertyId);
    setBookingDialogOpen(true);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-aquamarine-400 selection:text-emerald-950">
      {/* Luxury Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl animate-fade-in-down max-w-full overflow-hidden safe-top">
        <div className="mx-auto max-w-7xl w-full max-w-full overflow-hidden flex justify-between items-center h-16 md:h-20 px-4 xs:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 md:gap-3 group shrink-0 min-w-0">
            <div className="flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-sidebar shadow-md shadow-aquamarine-400/20 transition-transform group-hover:scale-105 animate-float-slow">
              <Palmtree className="h-5 w-5 md:h-6 md:w-6 text-emerald-950" />
            </div>
            <div className="min-w-0 hidden xs:block">
              <span className="text-sm md:text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5 md:gap-2">
                Aura Ceylon
                <Badge variant="outline" className="text-[9px] md:text-[10px] uppercase font-extrabold tracking-widest border-aquamarine-500/40 bg-aquamarine-500/10 text-aquamarine-600 dark:text-aquamarine-300 shrink-0">
                  Sanctuary
                </Badge>
              </span>
              <p className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-muted-foreground leading-tight">
                Sri Lanka Luxury Villas &amp; Resorts
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground shrink-0">
            <a href="#villas" className="hover:text-aquamarine-600 dark:hover:text-aquamarine-400 transition-colors">
              Villas &amp; Suites
            </a>
            <a href="#experiences" className="hover:text-aquamarine-600 dark:hover:text-aquamarine-400 transition-colors">
              Ceylon Experiences
            </a>
            <a href="#sanctuaries" className="hover:text-aquamarine-600 dark:hover:text-aquamarine-400 transition-colors">
              Destinations
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <Button asChild className="rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-md shadow-aquamarine-500/20 animate-pulse-glow min-h-[44px]">
                <Link href="/dashboard">
                  Guest Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="rounded-xl min-h-[44px]">
                  <Link href="/login">Guest Sign In</Link>
                </Button>
                <Button
                  onClick={() => handleOpenBooking()}
                  className="rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-md shadow-aquamarine-500/20 animate-pulse-glow min-h-[44px]"
                >
                  <Gem className="mr-1.5 h-4 w-4 shrink-0" />
                  Reserve a Stay
                </Button>
              </>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-11 w-11 rounded-xl shrink-0"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[380px] border-l border-border/60 bg-background safe-x overflow-y-auto">
              <div className="flex flex-col h-full pt-8 px-2">
                <div className="flex items-center gap-3 px-2 pb-6 border-b border-border/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-sidebar shadow-md shadow-aquamarine-400/20">
                    <Palmtree className="h-5 w-5 text-emerald-950" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5 flex-wrap">
                      Aura Ceylon
                      <Badge variant="outline" className="text-[9px] uppercase font-extrabold tracking-widest border-aquamarine-500/40 bg-aquamarine-500/10 text-aquamarine-600 dark:text-aquamarine-300">
                        Sanctuary
                      </Badge>
                    </span>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground leading-tight">
                      Luxury Villa Portal
                    </p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1 py-6">
                  <SheetClose asChild>
                    <a
                      href="#villas"
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-aquamarine-500/10 transition-colors min-h-[44px]"
                    >
                      <Gem className="h-5 w-5 text-aquamarine-600 dark:text-aquamarine-400 shrink-0" />
                      Villas &amp; Suites
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a
                      href="#experiences"
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-aquamarine-500/10 transition-colors min-h-[44px]"
                    >
                      <Compass className="h-5 w-5 text-aquamarine-600 dark:text-aquamarine-400 shrink-0" />
                      Ceylon Experiences
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a
                      href="#sanctuaries"
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-aquamarine-500/10 transition-colors min-h-[44px]"
                    >
                      <MapPin className="h-5 w-5 text-aquamarine-600 dark:text-aquamarine-400 shrink-0" />
                      Destinations
                    </a>
                  </SheetClose>
                </nav>

                <div className="mt-auto pt-6 border-t border-border/60 flex flex-col gap-3">
                  {user ? (
                    <SheetClose asChild>
                      <Button asChild className="w-full h-12 rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-bold text-base shadow-md shadow-aquamarine-500/20 min-h-[44px]">
                        <Link href="/dashboard">
                          Guest Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full h-12 rounded-xl font-semibold text-base border-border/80 min-h-[44px]">
                          <Link href="/login">
                            Guest Sign In
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          onClick={() => handleOpenBooking()}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-bold text-base shadow-md shadow-aquamarine-500/20 min-h-[44px]"
                        >
                          <Gem className="mr-2 h-5 w-5 shrink-0" />
                          Reserve a Stay
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-aquamarine-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-tr from-aquamarine-400/20 via-celadon-300/20 to-transparent blur-3xl pointer-events-none animate-orb" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-gradient-to-br from-celadon-300/15 to-aquamarine-400/10 blur-3xl pointer-events-none animate-orb-alt" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-aquamarine-500/40 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md animate-fade-in-down">
            <span className="flex h-2 w-2 rounded-full bg-aquamarine-500 animate-pulse" />
            <span>Sri Lanka&apos;s Premier Luxury Villa &amp; Resort Sanctuary</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance animate-fade-in-up delay-200">
            Where Tropical Elegance Meets{' '}
            <span className="bg-gradient-to-r from-aquamarine-600 via-aquamarine-500 to-celadon-400 bg-clip-text text-transparent animate-gradient-text bg-[size:200%_200%]">
              Timeless Ceylon Serenity
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground text-balance leading-relaxed animate-fade-in-up delay-400">
            Discover handpicked oceanfront pavilions in Bentota, misty tea estate chalets in Ella and Kandy, and regal heritage suites overlooking Sigiriya. Book directly with real-time Sri Lankan Rupee rates.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in-up delay-500">
            <Button
              size="lg"
              onClick={() => handleOpenBooking()}
              className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-aquamarine-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-aquamarine-500/30"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Villa or Suite
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto h-12 px-8 rounded-2xl border-border/80 bg-card/60 backdrop-blur-sm font-semibold text-base hover:bg-muted transition-all duration-300 hover:scale-105"
            >
              <Link href={user ? '/dashboard' : '/login'}>
                <Crown className="mr-2 h-5 w-5 text-aquamarine-600 dark:text-aquamarine-400" />
                {user ? 'Manage Reservations' : 'Explore Guest Folio'}
              </Link>
            </Button>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Curated Sanctuaries', value: '8 Luxury Villas', icon: Palmtree },
              { label: 'Guest Satisfaction', value: '4.96 / 5.0 Star', icon: Star },
              { label: 'Direct Rates', value: '100% LKR Best Price', icon: ShieldCheck },
              { label: 'Instant Confirmation', value: 'Live Sync', icon: CheckCircle2 },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-aquamarine-500/40 animate-fade-in-up"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <stat.icon className="h-5 w-5 text-aquamarine-600 dark:text-aquamarine-400 mb-1 animate-float-slow" style={{ animationDelay: `${i * 500}ms` }} />
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Villa & Suite Explorer Section */}
      <section id="villas" className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto scroll-fade-up">
          <Badge className="border-aquamarine-500/30 bg-aquamarine-500/10 text-aquamarine-600 dark:text-aquamarine-300 font-bold mb-3">
            Handcrafted Ceylon Stays
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Our Luxury Villas &amp; Suites
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Filter by destination, capacity, and bespoke amenities. All reservations feature direct LKR pricing and instant confirmation.
          </p>
        </div>

        <div className="scroll-fade-up">
          <VillaExplorer onSelectVilla={(id) => handleOpenBooking(id)} />
        </div>
      </section>

      {/* Signature Ceylon Experiences */}
      <section id="experiences" className="bg-muted/40 border-y border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14 scroll-fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-aquamarine-600 dark:text-aquamarine-400">
              Authentic Island Immersion
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-foreground">
              Signature Aura Ceylon Experiences
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Every stay is tailored with rich Sri Lankan cultural, culinary, and wellness rituals.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Coffee,
                title: 'Artisanal High Tea Plucking',
                desc: 'Pick single-origin Ceylon tea leaves with master planters in the mist-veiled Nuwara Eliya and Kandy highlands.',
              },
              {
                icon: Gem,
                title: 'Ayurvedic Wellness Retreats',
                desc: 'Ancient herbal oil elixirs, steam baths, and sunrise yoga guided by certified Sri Lankan Ayurvedic doctors.',
              },
              {
                icon: Waves,
                title: 'Private Catamaran & Whales',
                desc: 'Sail the azure waters of Mirissa and Bentota on private yachts to spot Blue Whales and playful spinner dolphins.',
              },
              {
                icon: Compass,
                title: 'Yala Leopard Safari Drives',
                desc: 'Traverse untamed jungle trails with seasoned naturalists for exclusive encounters with Sri Lankan leopards.',
              },
            ].map((exp, i) => (
              <div
                key={exp.title}
                className="group rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-aquamarine-500/40 hover:-translate-y-1.5 scroll-fade-up"
                style={{ ['--scroll-delay' as string]: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aquamarine-500/15 text-aquamarine-700 dark:text-aquamarine-300 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-aquamarine-500/25 group-hover:shadow-md group-hover:shadow-aquamarine-500/20">
                  <exp.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{exp.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 scroll-fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-aquamarine-600 dark:text-aquamarine-400">
            Guest Chronicles
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1">
            Praised by Discerning Travelers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote: 'Our stay at Ella Cloud Villa exceeded every expectation. Waking up to the mist over Little Adams Peak with Ceylon tea served on our deck was unforgettable.',
              author: 'Chaminda Jayasinghe',
              role: 'Executive Traveler, Colombo',
              villa: 'Ella Cloud Villa & Spa',
              rating: 5,
            },
            {
              quote: 'The oceanfront pavilion at Bentota is true tropical modernism at its finest. The staff attended to every single detail with warmth and grace.',
              author: 'Roshani Wickramasinghe',
              role: 'Architect & Designer',
              villa: 'Bentota Oceanfront Pavilion',
              rating: 5,
            },
            {
              quote: 'Sigiriya Heritage Suite gave us a private front-row seat to the ancient rock fortress. The curated sunrise safari tour was seamless and unforgettable.',
              author: 'Nuwan Fernando',
              role: 'Wildlife Enthusiast',
              villa: 'Sigiriya Heritage Royal Suite',
              rating: 5,
            },
          ].map((item, i) => (
            <div
              key={item.author}
              className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-aquamarine-500/30 hover:-translate-y-1 scroll-fade-up"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-sm font-bold text-foreground">{item.author}</p>
                <p className="text-[11px] text-muted-foreground">{item.role}</p>
                <p className="text-[10px] font-semibold text-aquamarine-600 dark:text-aquamarine-400 mt-0.5">
                  Stayed at {item.villa}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="mt-auto border-t border-sidebar-foreground/10 bg-sidebar text-sidebar-foreground max-w-full overflow-hidden safe-bottom">
        <div className="mx-auto max-w-7xl w-full max-w-full overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-12 md:py-12 lg:py-12">
          {/* Main Grid — 1 col mobile / 3 col md / 4 col lg */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 text-center md:text-left space-y-6 md:space-y-0">
            {/* Column 1: Branding & Locations */}
            <div className="lg:col-span-2 flex flex-col items-center md:items-start gap-4 md:gap-5 max-w-lg mx-auto md:mx-0">
              <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-emerald-950 shadow-lg shadow-aquamarine-400/20">
                  <Palmtree className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-sidebar-foreground">
                    Aura Ceylon
                    <Badge
                      variant="outline"
                      className="border-aquamarine-400/40 bg-aquamarine-400/10 text-[9px] font-extrabold uppercase tracking-widest text-aquamarine-300 shrink-0"
                    >
                      Sanctuary
                    </Badge>
                  </span>
                </div>
              </Link>
              <h3 className="text-base sm:text-lg font-bold leading-tight text-sidebar-foreground/95">
                Aura Ceylon Resorts &amp; Sanctuary
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1.5 text-[11px] sm:text-xs text-sidebar-foreground/60 leading-relaxed">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-aquamarine-400 shrink-0" />
                </span>
                {[
                  'Colombo',
                  'Kandy',
                  'Ella',
                  'Bentota',
                  'Mirissa',
                  'Sigiriya',
                  'Yala',
                ].map((city, i, arr) => (
                  <span key={city} className="inline-flex items-center">
                    <span className="text-sidebar-foreground/70">{city}</span>
                    {i < arr.length - 1 && (
                      <span className="mx-2 h-1 w-1 rounded-full bg-sidebar-foreground/25 inline-block align-middle" />
                    )}
                  </span>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-sidebar-foreground/50 leading-relaxed max-w-md break-words hyphens-auto">
                Handpicked oceanfront pavilions, misty tea estate chalets, and heritage suites across Sri Lanka. Direct LKR rates with instant confirmation.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2 w-full justify-center md:justify-start pb-1">
                <span className="h-px flex-1 bg-sidebar-foreground/10 md:hidden" />
                <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-aquamarine-300 shrink-0">
                  Quick Links
                </h4>
                <span className="h-px flex-1 bg-sidebar-foreground/10 md:hidden" />
              </div>
              <nav className="flex flex-col gap-1 w-full items-center md:items-start">
                {[
                  { href: '/dashboard', label: 'Reservations Ledger', icon: ShieldCheck },
                  { href: '/login', label: 'Guest Portal', icon: Users },
                  { href: '#villas', label: 'Villas & Suites', icon: Building2 },
                  { href: '#experiences', label: 'Ceylon Experiences', icon: Compass },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex w-full items-center justify-center md:justify-start gap-2 px-2 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-sidebar-foreground/70 hover:text-aquamarine-300 hover:bg-aquamarine-400/5 transition-all duration-200 min-h-[40px]"
                  >
                    <link.icon className="h-4 w-4 text-sidebar-foreground/40 group-hover:text-aquamarine-400 shrink-0 transition-colors" />
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Preferences / Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2 w-full justify-center md:justify-start pb-1">
                <span className="h-px flex-1 bg-sidebar-foreground/10 md:hidden" />
                <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-aquamarine-300 shrink-0">
                  Information
                </h4>
                <span className="h-px flex-1 bg-sidebar-foreground/10 md:hidden" />
              </div>
              <div className="flex flex-col gap-1.5 w-full items-center md:items-start">
                <div className="group inline-flex w-full items-center justify-center md:justify-start gap-3 px-2 py-3 rounded-lg hover:bg-aquamarine-400/5 transition-colors duration-200 min-h-[44px]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aquamarine-400/10 text-aquamarine-300 group-hover:bg-aquamarine-400/20 transition-colors">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                      Currency
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-sidebar-foreground/80 leading-tight">
                      LKR — Sri Lankan Rupee
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:concierge@auraceylon.lk"
                  className="group inline-flex w-full items-center justify-center md:justify-start gap-3 px-2 py-3 rounded-lg hover:bg-aquamarine-400/5 transition-colors duration-200 min-h-[44px]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aquamarine-400/10 text-aquamarine-300 group-hover:bg-aquamarine-400/20 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                      Concierge
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-sidebar-foreground/80 leading-tight group-hover:text-aquamarine-300 transition-colors">
                      concierge@auraceylon.lk
                    </span>
                  </div>
                </a>
                <a
                  href="tel:+94112345678"
                  className="group inline-flex w-full items-center justify-center md:justify-start gap-3 px-2 py-3 rounded-lg hover:bg-aquamarine-400/5 transition-colors duration-200 min-h-[44px]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aquamarine-400/10 text-aquamarine-300 group-hover:bg-aquamarine-400/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                      Reservations
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-sidebar-foreground/80 leading-tight group-hover:text-aquamarine-300 transition-colors">
                      +94 11 234 5678
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Divider & Copyright Bar */}
          <div className="mt-10 sm:mt-12 md:mt-14 border-t border-sidebar-foreground/10 pt-6 sm:pt-7 md:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-sidebar-foreground/45">
              <p className="text-center sm:text-left leading-relaxed break-words hyphens-auto order-2 sm:order-1">
                &copy; {new Date().getFullYear()} Aura Ceylon Resorts &amp; Sanctuary Ltd. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-2 order-1 sm:order-2">
                <span className="leading-relaxed hover:text-aquamarine-300 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
                <span className="hidden sm:inline w-px h-3 bg-sidebar-foreground/15" />
                <span className="leading-relaxed hover:text-aquamarine-300 transition-colors cursor-pointer">
                  Terms of Service
                </span>
                <span className="hidden sm:inline w-px h-3 bg-sidebar-foreground/15" />
                <span className="leading-relaxed hover:text-aquamarine-300 transition-colors cursor-pointer">
                  Guest Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Booking Modal */}
      <NewBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        defaultPropertyId={selectedPropertyId}
      />
    </div>
  );
}
