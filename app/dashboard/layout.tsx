'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-aquamarine-500" />
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
            Loading Aura Ceylon Sanctuary...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {!configured && (
          <div className="border-b border-aquamarine-500/30 bg-gradient-to-r from-aquamarine-500/10 via-celadon-300/10 to-transparent px-6 py-2 text-xs text-aquamarine-800 dark:text-aquamarine-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                <strong>Aura Ceylon Interactive Demo Mode:</strong> Operating with instant Sri Lankan mock state. Real Supabase sync activates when environment variables are supplied.
              </span>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-7xl p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
