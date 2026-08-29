export type UserRole = 'guest' | 'admin' | 'client';

export type ReservationStatus =
  | 'Confirmed'
  | 'Pending Payment'
  | 'Cancelled'
  | 'Completed';

export const RESERVATION_STATUSES: ReservationStatus[] = [
  'Confirmed',
  'Pending Payment',
  'Completed',
  'Cancelled',
];

// Backwards compatibility alias
export type BookingStatus = ReservationStatus;
export const BOOKING_STATUSES = RESERVATION_STATUSES;

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone?: string | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  property_name: string;
  location: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  guests_count: number;
  room_type: string;
  total_price_lkr: number;
  status: ReservationStatus;
  guest_name: string;
  guest_email: string;
  special_requests?: string | null;
  created_at: string;
  updated_at: string;
}

// Backwards compatibility alias
export type Booking = Reservation;

export type ReservationInsert = Omit<
  Reservation,
  'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'
> & {
  status?: ReservationStatus;
  user_id?: string;
};

export type BookingInsert = ReservationInsert;

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export interface Property {
  id: string;
  name: string;
  tagline: string;
  location: string;
  region: 'Central Highlands' | 'Southern Coast' | 'Cultural Triangle' | 'Wilderness';
  pricePerNightLkr: number;
  rating: number;
  reviewsCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  badge?: string;
  roomTypes: string[];
  amenities: string[];
  description: string;
  featured?: boolean;
}

export const SRI_LANKAN_PROPERTIES: Property[] = [
  {
    id: 'kandy-breeze',
    name: 'Kandy Mountain Breeze Suite',
    tagline: 'Mist-clad sanctuary overlooking the sacred Hanthana Mountain range',
    location: 'Hanthana, Kandy',
    region: 'Central Highlands',
    pricePerNightLkr: 68000,
    rating: 4.96,
    reviewsCount: 128,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    badge: 'Guest Favorite',
    roomTypes: ['Mountain View Deluxe Suite', 'Royal Ceylon Penthouse', 'Garden Pavilion Suite'],
    amenities: ['Private Infinity Plunge Pool', 'Ayurvedic Herbal Bath', 'Artisanal Ceylon Tea Bar', 'Panoramic Balcony', 'High-Speed Wi-Fi', 'Personal Butler'],
    description: 'Immerse yourself in lush hill-country serenity surrounded by whispering pines and eucalyptus mist. Enjoy sunset tea tastings and signature ayurvedic rejuvenation.',
    featured: true,
  },
  {
    id: 'ella-cloud',
    name: 'Ella Cloud Villa & Spa',
    tagline: 'Perched in the clouds facing the majestic Ella Rock and Nine Arch valley',
    location: 'Little Adams Peak, Ella',
    region: 'Central Highlands',
    pricePerNightLkr: 82000,
    rating: 4.98,
    reviewsCount: 215,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Signature Luxury',
    roomTypes: ['Cloud Valley Presidential Villa', 'Horizon Glass Suite', 'Tea Plantation Chalet'],
    amenities: ['Heated Infinity Pool', 'Private Chef Experience', 'Spa & Yoga Deck', 'Stargazing Telescope', 'Helipad Access', 'Fire Pit Lounge'],
    description: 'Wake up above the cloudline in this architectural masterpiece blending sustainable Teak timber, glass facades, and bespoke Sri Lankan artisanal stonecraft.',
    featured: true,
  },
  {
    id: 'bentota-ocean',
    name: 'Bentota Oceanfront Pavilion',
    tagline: 'Golden sands and azure Indian Ocean breakers at your private doorstep',
    location: 'Bentota Beach, Galle Road',
    region: 'Southern Coast',
    pricePerNightLkr: 95000,
    rating: 4.94,
    reviewsCount: 174,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    badge: 'Oceanfront Beach Club',
    roomTypes: ['Oceanfront Grand Pavilion', 'Sunset Lagoon Suite', 'Beach Garden Cabana'],
    amenities: ['Direct Beach Access', 'Private Catamaran Charter', 'Beachside Cabana Bar', 'Seafood Grill BBQ', 'Deep-Soaking Jacuzzi', '24/7 Concierge'],
    description: 'A modern tropical sanctuary designed in homage to Geoffrey Bawa tropical modernism, featuring soaring open verandahs and uninterrupted sunset vistas.',
    featured: true,
  },
  {
    id: 'mirissa-bungalow',
    name: 'Mirissa Beachside Bungalow',
    tagline: 'Bohemian luxury steps from Coconut Tree Hill and dolphin bays',
    location: 'Coconut Tree Hill, Mirissa',
    region: 'Southern Coast',
    pricePerNightLkr: 52000,
    rating: 4.89,
    reviewsCount: 96,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    badge: 'Coastal Charm',
    roomTypes: ['Palm Canopy Bungalow', 'Surf Crest Suite', 'Turquoise Garden Loft'],
    amenities: ['Private Surf Deck', 'Sunset Cocktail Bar', 'Outdoor Rainforest Shower', 'Complimentary Bicycles', 'Whale Watching Charter', 'Daily Tropical Breakfast'],
    description: 'Surrounded by swaying coconut palms, enjoy fresh coastal breezes, handcrafted rattan loungers, and easy access to the vibrant surf and whale watching excursions.',
    featured: false,
  },
  {
    id: 'sigiriya-heritage',
    name: 'Sigiriya Heritage Royal Suite',
    tagline: 'Regal sanctuary gazing directly upon the historic 5th-century Lion Rock',
    location: 'Water Gardens Road, Sigiriya',
    region: 'Cultural Triangle',
    pricePerNightLkr: 76000,
    rating: 4.97,
    reviewsCount: 189,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    badge: 'Heritage Elite',
    roomTypes: ['Royal Citadel King Suite', 'Lotus Pond Garden Pavilion', 'Monarch Family Villa'],
    amenities: ['Lion Rock Panoramic Deck', 'Ayurvedic Wellness Sanctuary', 'Bird Watching Trail', 'Cultural Guided Tours', 'Private Lily Pond Dining', 'Buggy Service'],
    description: 'Live like ancient royalty amid manicured water gardens, indigenous flora, and untamed heritage beauty within minutes of the UNESCO World Heritage fortress.',
    featured: true,
  },
  {
    id: 'nuwara-eliya-estate',
    name: 'Nuwara Eliya Colonial Estate',
    tagline: 'Highland heritage elegance amidst emerald single-origin tea hills',
    location: 'Pedro Estate Road, Nuwara Eliya',
    region: 'Central Highlands',
    pricePerNightLkr: 64000,
    rating: 4.91,
    reviewsCount: 142,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    badge: 'Colonial Elegance',
    roomTypes: ['Planters Heritage Suite', 'Highland Rose Cottage', 'Emerald Glen Villa'],
    amenities: ['Fireplace in Every Room', 'High Tea Verandah', 'Private Tea Plucking Experience', 'Golf Course Shuttle', 'Library & Billiard Room', 'Heated Bathrooms'],
    description: 'Experience timeless Little England charm with crackling log fires, vintage teak woodwork, polished brass fixtures, and world-renowned Ceylon High Tea.',
    featured: false,
  },
  {
    id: 'galle-fort-manor',
    name: 'Galle Fort Colonial Manor',
    tagline: '18th-century Dutch colonial luxury within the historic fort ramparts',
    location: 'Church Street, Galle Fort',
    region: 'Southern Coast',
    pricePerNightLkr: 88000,
    rating: 4.95,
    reviewsCount: 160,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    badge: 'UNESCO Heritage',
    roomTypes: ['Governor Heritage Suite', 'Courtyard Pool Villa', 'Rampart View Loft'],
    amenities: ['Central Courtyard Pool', 'Antique Four-Poster Beds', 'Bespoke Spice Tasting', 'Rampart Walking Access', 'Art Gallery Lounge', 'Fine Wine Cellar'],
    description: 'Historic colonial architecture seamlessly combined with plush contemporary luxury, vaulted terracotta ceilings, and courtyards scented with frangipani.',
    featured: false,
  },
  {
    id: 'yala-safari-lodge',
    name: 'Yala Wilderness Safari Lodge',
    tagline: 'Luxury tented sanctuary where the untamed jungle meets the Indian Ocean',
    location: 'Palatupana, Yala National Park',
    region: 'Wilderness',
    pricePerNightLkr: 110000,
    rating: 4.99,
    reviewsCount: 230,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    badge: 'Exclusive Safari',
    roomTypes: ['Leopard Trail Tented Suite', 'Ocean Dunes Pavilion', 'Jungle Luxury Lodge'],
    amenities: ['Private Safari Game Drives', 'Naturalist Guide Service', 'Bush BBQ Under the Stars', 'Private Outdoor Plunge Pool', 'Wild Animal Lookout Deck', 'All-Inclusive Dining'],
    description: 'The pinnacle of bespoke luxury safari experience. Spot elusive Sri Lankan leopards, wild elephants, and vibrant birdlife from your private luxury deck.',
    featured: true,
  }
];

export const INITIAL_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-ceylon-001',
    user_id: 'guest-usr-01',
    property_name: 'Ella Cloud Villa & Spa',
    location: 'Little Adams Peak, Ella',
    check_in: '2026-09-12',
    check_out: '2026-09-16',
    guests_count: 2,
    room_type: 'Cloud Valley Presidential Villa',
    total_price_lkr: 328000,
    status: 'Confirmed',
    guest_name: 'Chaminda Jayasinghe',
    guest_email: 'chaminda.j@ceylonholdings.lk',
    special_requests: 'Anniversary celebration. Please arrange a champagne sunset setup on the private deck.',
    created_at: '2026-08-25T09:30:00.000Z',
    updated_at: '2026-08-25T10:15:00.000Z',
  },
  {
    id: 'res-ceylon-002',
    user_id: 'guest-usr-02',
    property_name: 'Bentota Oceanfront Pavilion',
    location: 'Bentota Beach, Galle Road',
    check_in: '2026-09-20',
    check_out: '2026-09-24',
    guests_count: 4,
    room_type: 'Oceanfront Grand Pavilion',
    total_price_lkr: 380000,
    status: 'Pending Payment',
    guest_name: 'Roshani Wickramasinghe',
    guest_email: 'roshani.w@colombomedia.com',
    special_requests: 'Airport luxury transfer from BIA Katunayake requested at 14:00.',
    created_at: '2026-08-26T14:20:00.000Z',
    updated_at: '2026-08-26T14:20:00.000Z',
  },
  {
    id: 'res-ceylon-003',
    user_id: 'guest-usr-03',
    property_name: 'Sigiriya Heritage Royal Suite',
    location: 'Water Gardens Road, Sigiriya',
    check_in: '2026-10-02',
    check_out: '2026-10-05',
    guests_count: 2,
    room_type: 'Royal Citadel King Suite',
    total_price_lkr: 228000,
    status: 'Confirmed',
    guest_name: 'Nuwan Fernando',
    guest_email: 'nuwan.fernando@teaexports.lk',
    special_requests: 'Private guided sunrise tour of Sigiriya Lion Rock on the 3rd.',
    created_at: '2026-08-27T08:10:00.000Z',
    updated_at: '2026-08-27T09:00:00.000Z',
  },
  {
    id: 'res-ceylon-004',
    user_id: 'guest-usr-04',
    property_name: 'Kandy Mountain Breeze Suite',
    location: 'Hanthana, Kandy',
    check_in: '2026-08-14',
    check_out: '2026-08-18',
    guests_count: 3,
    room_type: 'Mountain View Deluxe Suite',
    total_price_lkr: 272000,
    status: 'Completed',
    guest_name: 'Anusha Bandara',
    guest_email: 'anusha.bandara@peradeniya.ac.lk',
    special_requests: 'Herbal tea welcome assortment and late checkout at 13:00.',
    created_at: '2026-08-10T11:00:00.000Z',
    updated_at: '2026-08-18T12:00:00.000Z',
  },
  {
    id: 'res-ceylon-005',
    user_id: 'guest-usr-05',
    property_name: 'Yala Wilderness Safari Lodge',
    location: 'Palatupana, Yala National Park',
    check_in: '2026-09-01',
    check_out: '2026-09-04',
    guests_count: 2,
    room_type: 'Leopard Trail Tented Suite',
    total_price_lkr: 330000,
    status: 'Confirmed',
    guest_name: 'Dinesh Samarasinghe',
    guest_email: 'dinesh.s@lankaviews.com',
    special_requests: 'Senior naturalist required for the dusk game drive.',
    created_at: '2026-08-27T16:45:00.000Z',
    updated_at: '2026-08-27T17:00:00.000Z',
  },
  {
    id: 'res-ceylon-006',
    user_id: 'guest-usr-06',
    property_name: 'Mirissa Beachside Bungalow',
    location: 'Coconut Tree Hill, Mirissa',
    check_in: '2026-08-01',
    check_out: '2026-08-04',
    guests_count: 2,
    room_type: 'Palm Canopy Bungalow',
    total_price_lkr: 156000,
    status: 'Cancelled',
    guest_name: 'Dilshan Senanayake',
    guest_email: 'dilshan.s@ceylonventures.com',
    special_requests: 'Cancelled due to travel rescheduling.',
    created_at: '2026-07-28T09:00:00.000Z',
    updated_at: '2026-07-30T14:30:00.000Z',
  }
];

export function formatLKR(amount: number): string {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`;
}
