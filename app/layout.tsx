import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aura Ceylon Resorts & Sanctuary — Sri Lanka Luxury Villa & Hotel Reservations',
  description:
    'Experience the pinnacle of Sri Lankan luxury hospitality. Reserve bespoke oceanfront pavilions, mist-veiled highland villas, and heritage suites in Bentota, Ella, Kandy, Sigiriya, and Yala with real-time LKR pricing.',
  keywords: [
    'Aura Ceylon Resorts',
    'Sri Lanka Luxury Villas',
    'Hotel Reservations Sri Lanka',
    'Ella Cloud Villa',
    'Bentota Oceanfront Pavilion',
    'Kandy Mountain Breeze',
    'Sigiriya Heritage Royal Suite',
    'LKR Hotel Booking',
  ],
  authors: [{ name: 'Aura Ceylon Hospitality Group' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
