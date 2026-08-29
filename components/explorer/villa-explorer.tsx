'use client';

import { useState, useMemo } from 'react';
import {
  SRI_LANKAN_PROPERTIES,
  type Property,
  formatLKR,
} from '@/lib/types';
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Gem,
  Search,
  Filter,
  Check,
  Calendar,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NewBookingDialog } from '@/components/dashboard/new-booking-dialog';

const REGIONS = [
  'All Regions',
  'Central Highlands',
  'Southern Coast',
  'Cultural Triangle',
  'Wilderness',
] as const;

export function VillaExplorer({ onSelectVilla }: { onSelectVilla?: (propertyId: string) => void }) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [targetPropertyId, setTargetPropertyId] = useState<string | undefined>(undefined);

  const filteredProperties = useMemo(() => {
    return SRI_LANKAN_PROPERTIES.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.amenities.some((a) => a.toLowerCase().includes(q));

      const matchesRegion =
        selectedRegion === 'All Regions' || p.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  function handleBookNow(propertyId: string) {
    if (onSelectVilla) {
      onSelectVilla(propertyId);
    } else {
      setTargetPropertyId(propertyId);
      setBookingDialogOpen(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Explorer Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search villas by name, location (Ella, Kandy, Bentota), or amenities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card/80 border-border/70 rounded-xl"
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-aquamarine-500 to-emerald-600 text-white shadow-sm shadow-aquamarine-500/20'
                  : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Villas */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-card/40 rounded-3xl border border-dashed border-border/80">
          <p className="text-lg font-semibold">No sanctuaries match your criteria</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search query or switching regions.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedRegion('All Regions');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <VillaCard
              key={property.id}
              property={property}
              onBook={() => handleBookNow(property.id)}
            />
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <NewBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        defaultPropertyId={targetPropertyId}
      />
    </div>
  );
}

function VillaCard({
  property,
  onBook,
}: {
  property: Property;
  onBook: () => void;
}) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-3xl border-border/70 bg-card/95 transition-all duration-300 hover:shadow-xl hover:shadow-aquamarine-500/10 hover:-translate-y-1.5">
      {/* Property Image Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.imageUrl}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        {property.badge && (
          <Badge className="absolute left-3.5 top-3.5 border-none bg-aquamarine-500/90 backdrop-blur-md text-emerald-950 font-bold text-xs shadow-md">
            <Gem className="mr-1 h-3 w-3" />
            {property.badge}
          </Badge>
        )}

        {/* Rating */}
        <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{property.rating}</span>
          <span className="text-white/70">({property.reviewsCount})</span>
        </div>

        {/* Location & Region Overlay */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <p className="flex items-center gap-1 text-xs font-medium text-celadon-200">
            <MapPin className="h-3.5 w-3.5 text-aquamarine-400" />
            {property.location}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-white tracking-tight leading-snug">
            {property.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-1 flex-col justify-between p-5 space-y-4">
        {/* Tagline & Specs */}
        <div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {property.tagline}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground border-y border-border/50 py-2.5">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-aquamarine-600 dark:text-aquamarine-400" />
              <span>Up to {property.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-aquamarine-600 dark:text-aquamarine-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-aquamarine-600 dark:text-aquamarine-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground/80"
              >
                <Check className="mr-1 h-3 w-3 text-aquamarine-500" />
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] text-muted-foreground self-center">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Starting From
            </p>
            <p className="text-base font-extrabold text-foreground tracking-tight">
              {formatLKR(property.pricePerNightLkr)}
              <span className="text-xs font-normal text-muted-foreground"> / night</span>
            </p>
          </div>
          <Button
            onClick={onBook}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-aquamarine-500 to-emerald-600 hover:from-aquamarine-600 hover:to-emerald-700 text-white font-semibold shadow-sm"
          >
            Reserve
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
