'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Palmtree,
  LayoutDashboard,
  CalendarCheck,
  Compass,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Gem,
  ExternalLink,
  Crown,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const navItems = [
  { href: '/dashboard', label: 'Overview & Stays', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'Reservations Ledger', icon: CalendarCheck },
  { href: '/', label: 'Guest Explorer Portal', icon: Compass, external: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, role, signOut, signInAsDemo } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (profile?.full_name || user?.email || 'Aura')
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  function handleToggleRole() {
    const nextRole = role === 'admin' ? 'guest' : 'admin';
    signInAsDemo(nextRole);
    toast.success(`Switched mode to ${nextRole === 'admin' ? 'Resort Concierge / Admin' : 'Luxury Guest'}`);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-foreground/10">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-sidebar-foreground/10 px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-aquamarine-400 to-celadon-300 text-sidebar shadow-md shadow-aquamarine-400/20 transition-transform group-hover:scale-105">
            <Palmtree className="h-5 w-5 text-emerald-950" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celadon-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-celadon-300" />
            </span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-sidebar-foreground flex items-center gap-1.5">
              Aura Ceylon
            </span>
            <p className="text-[11px] font-medium tracking-widest uppercase text-aquamarine-400">
              Resorts & Sanctuary
            </p>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1.5 p-4">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Sanctuary Management
        </div>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && !item.external && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-aquamarine-400/20 to-celadon-300/10 text-aquamarine-300 border border-aquamarine-400/30 shadow-sm'
                  : 'text-sidebar-foreground/75 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn('h-4 w-4', active ? 'text-aquamarine-400' : 'text-sidebar-foreground/60')} />
                <span>{item.label}</span>
              </div>
              {item.external && (
                <ExternalLink className="h-3.5 w-3.5 text-sidebar-foreground/40" />
              )}
            </Link>
          );
        })}

        {/* Demo Mode Switcher Card */}
        <div className="mt-8 rounded-2xl border border-sidebar-foreground/15 bg-sidebar-foreground/5 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sidebar-foreground flex items-center gap-1.5">
              <Gem className="h-3.5 w-3.5 text-aquamarine-400" />
              Active Persona
            </span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] uppercase font-bold tracking-wider',
                role === 'admin'
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                  : 'border-aquamarine-400/40 bg-aquamarine-400/10 text-aquamarine-300'
              )}
            >
              {role === 'admin' ? 'Concierge' : 'Luxury Guest'}
            </Badge>
          </div>
          <p className="mt-1.5 text-sidebar-foreground/60 text-[11px] leading-relaxed">
            {role === 'admin'
              ? 'Viewing full resort master ledger with override status permissions.'
              : 'Viewing guest reservations and personalized Ceylon itineraries.'}
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleRole}
            className="mt-3 w-full justify-center border border-sidebar-foreground/20 bg-sidebar-foreground/10 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-foreground/20 hover:text-white"
          >
            {role === 'admin' ? (
              <>
                <UserCheck className="mr-1.5 h-3.5 w-3.5 text-aquamarine-400" /> Switch to Guest View
              </>
            ) : (
              <>
                <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> Switch to Concierge View
              </>
            )}
          </Button>
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-foreground/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-aquamarine-400/30">
            <AvatarFallback className="bg-gradient-to-br from-aquamarine-500/30 to-celadon-400/20 text-aquamarine-300 text-xs font-bold">
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {profile?.full_name || 'Chaminda Jayasinghe'}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.email || 'guest@auraceylon.lk'}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-rose-400 transition-colors"
            onClick={signOut}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-sidebar px-4 text-sidebar-foreground lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aquamarine-400 text-sidebar font-bold">
            <Palmtree className="h-4 w-4 text-emerald-950" />
          </div>
          <div>
            <span className="text-sm font-bold">Aura Ceylon</span>
            <span className="ml-1 text-[10px] text-aquamarine-400">Resorts</span>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 animate-fade-in shadow-2xl">
            <button
              className="absolute right-3 top-5 z-10 text-sidebar-foreground/70 hover:text-sidebar-foreground p-1 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
