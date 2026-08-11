/**
 * LUXDRIVE — Application Constants
 * Single source of truth for all fixed values used across the frontend.
 */

// ── App Info ──────────────────────────────────────────────────
export const APP_NAME    = 'LUXDRIVE'
export const APP_TAGLINE = 'Drive The Extraordinary'
export const APP_CURRENCY = 'KES'
export const APP_CURRENCY_SYMBOL = 'KSh'

// ── Routes ─────────────────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME:           '/',
  CARS:           '/cars',
  CAR_DETAILS:    '/cars/:id',
  SERVICES:       '/services',
  ABOUT:          '/about',
  CONTACT:        '/contact',
  FAQ:            '/faq',
  TERMS:          '/terms',
  PRIVACY:        '/privacy',

  // Auth
  LOGIN:          '/login',
  REGISTER:       '/register',
  FORGOT_PASSWORD:'/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL:   '/auth/verify',
  AUTH_CALLBACK:  '/auth/callback',
  UNAUTHORIZED:   '/unauthorized',

  // Customer Dashboard
  DASHBOARD:      '/dashboard',
  MY_BOOKINGS:    '/dashboard/bookings',
  BOOKING_DETAIL: '/dashboard/bookings/:id',
  FAVORITES:      '/dashboard/favorites',
  PROFILE:        '/dashboard/profile',
  NOTIFICATIONS:  '/dashboard/notifications',
  PAYMENTS_HISTORY:'/dashboard/payments',

  // Booking Flow
  BOOKING:        '/booking/:carId',
  CHECKOUT:       '/checkout/:bookingId',
  BOOKING_CONFIRM:'/booking/confirmation/:bookingId',

  // Admin
  ADMIN:                '/admin',
  ADMIN_DASHBOARD:      '/admin/dashboard',
  ADMIN_CARS:           '/admin/cars',
  ADMIN_CAR_NEW:        '/admin/cars/new',
  ADMIN_CAR_EDIT:       '/admin/cars/:id/edit',
  ADMIN_BOOKINGS:       '/admin/bookings',
  ADMIN_BOOKING_DETAIL: '/admin/bookings/:id',
  ADMIN_CUSTOMERS:      '/admin/customers',
  ADMIN_CUSTOMER_DETAIL:'/admin/customers/:id',
  ADMIN_PAYMENTS:       '/admin/payments',
  ADMIN_LOCATIONS:      '/admin/locations',
  ADMIN_SERVICES:       '/admin/services',
  ADMIN_REVIEWS:        '/admin/reviews',
  ADMIN_SETTINGS:       '/admin/settings',
}

// ── User Roles ─────────────────────────────────────────────────
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN:    'ADMIN',
}

// ── Account Status ─────────────────────────────────────────────
export const ACCOUNT_STATUS = {
  ACTIVE:      'ACTIVE',
  SUSPENDED:   'SUSPENDED',
  DISABLED:    'DISABLED',
}

// ── Vehicle Status ─────────────────────────────────────────────
export const VEHICLE_STATUS = {
  AVAILABLE:   'AVAILABLE',
  RESERVED:    'RESERVED',
  RENTED:      'RENTED',
  MAINTENANCE: 'MAINTENANCE',
  UNAVAILABLE: 'UNAVAILABLE',
}

// ── Booking Status ─────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:   'PENDING',
  CONFIRMED: 'CONFIRMED',
  ACTIVE:    'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED:  'REJECTED',
  EXPIRED:   'EXPIRED',
}

// ── Payment Status ─────────────────────────────────────────────
export const PAYMENT_STATUS = {
  PENDING:            'PENDING',
  SUCCESSFUL:         'SUCCESSFUL',
  FAILED:             'FAILED',
  REFUNDED:           'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
}

// ── Payment Method ─────────────────────────────────────────────
export const PAYMENT_METHOD = {
  MPESA:         'MPESA',
  CARD:          'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  OTHER:         'OTHER',
}

// ── Rental Type ─────────────────────────────────────────────────
export const RENTAL_TYPE = {
  SELF_DRIVE: 'SELF_DRIVE',
  CHAUFFEUR:  'CHAUFFEUR',
}

// ── Car Categories ──────────────────────────────────────────────
export const CAR_CATEGORIES = [
  { value: 'SEDAN',        label: 'Sedan' },
  { value: 'SUV',          label: 'SUV' },
  { value: 'COUPE',        label: 'Coupe' },
  { value: 'CONVERTIBLE',  label: 'Convertible' },
  { value: 'SPORTS_CAR',   label: 'Sports Car' },
  { value: 'LUXURY_SEDAN', label: 'Luxury Sedan' },
  { value: 'ELECTRIC',     label: 'Electric' },
]

// ── Car Brands ──────────────────────────────────────────────────
export const CAR_BRANDS = [
  'BMW',
  'Mercedes-Benz',
  'Porsche',
  'Range Rover',
  'Audi',
  'Lexus',
  'Jaguar',
  'Maserati',
  'Bentley',
  'Aston Martin',
]

// ── Transmission Types ──────────────────────────────────────────
export const TRANSMISSION_TYPES = [
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'MANUAL',    label: 'Manual' },
]

// ── Fuel Types ──────────────────────────────────────────────────
export const FUEL_TYPES = [
  { value: 'PETROL',   label: 'Petrol' },
  { value: 'DIESEL',   label: 'Diesel' },
  { value: 'HYBRID',   label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
]

// ── Price Ranges (for filter UI) ────────────────────────────────
export const PRICE_RANGES = [
  { label: 'Under KSh 20,000',         min: 0,      max: 20000  },
  { label: 'KSh 20,000 – 40,000',      min: 20000,  max: 40000  },
  { label: 'KSh 40,000 – 70,000',      min: 40000,  max: 70000  },
  { label: 'KSh 70,000 – 100,000',     min: 70000,  max: 100000 },
  { label: 'Above KSh 100,000',        min: 100000, max: null   },
]

// ── Seat Options ────────────────────────────────────────────────
export const SEAT_OPTIONS = [2, 4, 5, 6, 7, 8]

// ── Sort Options ────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'featured',     label: 'Featured' },
  { value: 'price_asc',    label: 'Price: Low to High' },
  { value: 'price_desc',   label: 'Price: High to Low' },
  { value: 'newest',       label: 'Newest' },
  { value: 'highest_rated',label: 'Highest Rated' },
]

// ── Pagination ──────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12
export const ADMIN_PAGE_SIZE   = 20

// ── Booking Rules ───────────────────────────────────────────────
export const MIN_RENTAL_DAYS             = 1
export const MAX_RENTAL_DAYS             = 90
export const MIN_BOOKING_NOTICE_HOURS    = 4
export const PENDING_BOOKING_EXPIRY_MINS = 30

// ── Tax ─────────────────────────────────────────────────────────
export const TAX_RATE = 0.16  // 16% VAT — display only, server calculates

// ── Image ───────────────────────────────────────────────────────
export const ALLOWED_IMAGE_TYPES    = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_MB      = 10
export const MAX_IMAGE_SIZE_BYTES   = MAX_IMAGE_SIZE_MB * 1024 * 1024

// ── Booking Status — colours for the UI ─────────────────────────
export const BOOKING_STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   variant: 'pending',   color: 'text-warning-500'  },
  CONFIRMED: { label: 'Confirmed', variant: 'confirmed', color: 'text-success-500'  },
  ACTIVE:    { label: 'Active',    variant: 'rented',    color: 'text-info-500'     },
  COMPLETED: { label: 'Completed', variant: 'confirmed', color: 'text-surface-400'  },
  CANCELLED: { label: 'Cancelled', variant: 'cancelled', color: 'text-error-500'    },
  REJECTED:  { label: 'Rejected',  variant: 'cancelled', color: 'text-error-500'    },
  EXPIRED:   { label: 'Expired',   variant: 'unavailable',color:'text-surface-500'  },
}

// ── Notification Types ──────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  BOOKING: 'BOOKING',
  PAYMENT: 'PAYMENT',
  REMINDER:'REMINDER',
  SYSTEM:  'SYSTEM',
  REVIEW:  'REVIEW',
}

// ── Services ───────────────────────────────────────────────────
export const LUXURY_SERVICES = [
  {
    slug:        'airport-transfer',
    title:       'Airport Transfers',
    description: 'Seamless luxury arrivals and departures.',
  },
  {
    slug:        'chauffeur',
    title:       'Chauffeur Services',
    description: 'Professional drivers for every occasion.',
  },
  {
    slug:        'wedding',
    title:       'Wedding Cars',
    description: 'Make your special day extraordinary.',
  },
  {
    slug:        'corporate',
    title:       'Corporate Rentals',
    description: 'Executive vehicles for business professionals.',
  },
  {
    slug:        'vip-events',
    title:       'VIP Events',
    description: 'Arrive in style at any event.',
  },
  {
    slug:        'hotel-delivery',
    title:       'Hotel Delivery',
    description: 'Vehicle delivered directly to your hotel.',
  },
]

// ── FAQ items ──────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: 'What documents do I need to rent a vehicle?',
    answer:   'A valid driving licence and a national ID or passport are required. For premium vehicles, we may also require proof of insurance and a credit/debit card for the security deposit.',
  },
  {
    question: 'Is there a minimum rental period?',
    answer:   'Our minimum rental period is 1 day (24 hours). Longer rental periods attract discounted daily rates.',
  },
  {
    question: 'How does the security deposit work?',
    answer:   'A refundable security deposit is required for all rentals. The amount varies by vehicle. It is returned in full after the vehicle is inspected and returned in the same condition.',
  },
  {
    question: 'Can I get the vehicle delivered to me?',
    answer:   'Yes. We offer hotel, airport, and office delivery across Nairobi and major towns. A delivery fee applies depending on your location.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:   'Cancellations made more than 72 hours before pickup receive a full rental refund. Cancellations within 24–72 hours receive a partial refund. Cancellations under 24 hours may not qualify for a refund.',
  },
  {
    question: 'Do you offer chauffeur services?',
    answer:   'Yes. All our vehicles are available with a professional, vetted chauffeur. Chauffeur rates are shown separately on each vehicle page.',
  },
]
