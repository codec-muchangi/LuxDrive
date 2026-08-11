/**
 * LUXDRIVE — Utility Functions
 * Shared helpers used across the frontend.
 */

import { format, differenceInCalendarDays, isPast, isValid, parseISO } from 'date-fns'

// ── Currency ──────────────────────────────────────────────────
/**
 * Formats a number as KES currency.
 * Example: 25000 → "KSh 25,000"
 */
export function formatCurrency(amount, currency = 'KES') {
  if (amount == null || isNaN(amount)) return '—'

  const prefixMap = {
    KES: 'KSh',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  const prefix = prefixMap[currency] || currency
  const formatted = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))

  return `${prefix} ${formatted}`
}

/**
 * Formats a compact price for car cards.
 * Example: 25000 → "KSh 25,000 / day"
 */
export function formatDailyRate(amount, currency = 'KES') {
  return `${formatCurrency(amount, currency)} / day`
}

// ── Dates ─────────────────────────────────────────────────────
/**
 * Formats a date string for display.
 * Example: "2026-08-15" → "15 Aug 2026"
 */
export function formatDate(dateStr, pattern = 'd MMM yyyy') {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  if (!isValid(date)) return '—'
  return format(date, pattern)
}

/**
 * Formats a date range for booking display.
 * Example: "15 Aug 2026 → 18 Aug 2026"
 */
export function formatDateRange(pickupDate, returnDate) {
  return `${formatDate(pickupDate)} → ${formatDate(returnDate)}`
}

/**
 * Calculates number of rental days between two dates.
 * Uses calendar days (matching backend logic).
 */
export function calculateRentalDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 0
  const pickup = typeof pickupDate === 'string' ? parseISO(pickupDate) : pickupDate
  const ret    = typeof returnDate === 'string' ? parseISO(returnDate) : returnDate
  const days = differenceInCalendarDays(ret, pickup)
  return Math.max(0, days)
}

/**
 * Checks if a date is in the past.
 */
export function isDateInPast(dateStr) {
  if (!dateStr) return false
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  return isPast(date)
}

/**
 * Returns today's date as ISO string (YYYY-MM-DD).
 */
export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Returns minimum return date given a pickup date and min rental days.
 */
export function getMinReturnDate(pickupDate, minRentalDays = 1) {
  if (!pickupDate) return todayISO()
  const pickup = typeof pickupDate === 'string' ? parseISO(pickupDate) : pickupDate
  const minReturn = new Date(pickup)
  minReturn.setDate(minReturn.getDate() + minRentalDays)
  return format(minReturn, 'yyyy-MM-dd')
}

// ── Booking Reference ─────────────────────────────────────────
/**
 * Truncates a booking UUID for display in tables.
 * Full reference (e.g., LD-2026-001024) is preferred.
 */
export function truncateRef(str, length = 8) {
  if (!str) return '—'
  return str.length > length ? `${str.substring(0, length)}…` : str
}

// ── Status Labels ─────────────────────────────────────────────
export const VEHICLE_STATUS_LABELS = {
  AVAILABLE:    'Available',
  RESERVED:     'Reserved',
  RENTED:       'Rented',
  MAINTENANCE:  'Maintenance',
  UNAVAILABLE:  'Unavailable',
}

export const BOOKING_STATUS_LABELS = {
  PENDING:    'Pending',
  CONFIRMED:  'Confirmed',
  ACTIVE:     'Active',
  COMPLETED:  'Completed',
  CANCELLED:  'Cancelled',
  REJECTED:   'Rejected',
  EXPIRED:    'Expired',
}

export const PAYMENT_STATUS_LABELS = {
  PENDING:             'Pending',
  SUCCESSFUL:          'Paid',
  FAILED:              'Failed',
  REFUNDED:            'Refunded',
  PARTIALLY_REFUNDED:  'Partial Refund',
}

export const RENTAL_TYPE_LABELS = {
  SELF_DRIVE: 'Self Drive',
  CHAUFFEUR:  'Chauffeur',
}

// ── Status Badge Variants ─────────────────────────────────────
export function getVehicleStatusVariant(status) {
  const map = {
    AVAILABLE:   'available',
    RESERVED:    'reserved',
    RENTED:      'rented',
    MAINTENANCE: 'maintenance',
    UNAVAILABLE: 'unavailable',
  }
  return map[status] || 'unavailable'
}

export function getBookingStatusVariant(status) {
  const map = {
    PENDING:   'pending',
    CONFIRMED: 'confirmed',
    ACTIVE:    'rented',
    COMPLETED: 'confirmed',
    CANCELLED: 'cancelled',
    REJECTED:  'cancelled',
    EXPIRED:   'unavailable',
  }
  return map[status] || 'unavailable'
}

// ── Strings ───────────────────────────────────────────────────
/**
 * Capitalises first letter of each word.
 */
export function titleCase(str) {
  if (!str) return ''
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Formats enum value for display: "SPORTS_CAR" → "Sports Car"
 */
export function formatEnum(value) {
  if (!value) return ''
  return titleCase(value.replace(/_/g, ' '))
}

// ── Validation ─────────────────────────────────────────────────
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidKenyanPhone(phone) {
  // Accepts: +254xxxxxxxxx, 07xxxxxxxx, 01xxxxxxxx
  return /^(\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))
}

export function normalisePhone(phone) {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.substring(1)}`
  }
  return cleaned
}

// ── Images ───────────────────────────────────────────────────
/**
 * Returns a placeholder gradient when a vehicle has no image.
 * Uses the car brand to pick a consistent color.
 */
export function getCarPlaceholderClass(brand) {
  const map = {
    BMW:           'from-blue-950 to-blue-900',
    'Mercedes-Benz': 'from-slate-900 to-slate-800',
    Porsche:       'from-red-950 to-red-900',
    'Range Rover': 'from-green-950 to-green-900',
    Audi:          'from-zinc-900 to-zinc-800',
    Lexus:         'from-indigo-950 to-indigo-900',
    Jaguar:        'from-emerald-950 to-emerald-900',
    Maserati:      'from-sky-950 to-sky-900',
    Bentley:       'from-amber-950 to-amber-900',
  }
  return map[brand] || 'from-primary-900 to-primary-800'
}

// ── Number formatting ─────────────────────────────────────────
export function formatNumber(n) {
  if (n == null) return '0'
  return new Intl.NumberFormat('en-KE').format(n)
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(str, maxLength = 100) {
  if (!str) return ''
  return str.length > maxLength ? `${str.substring(0, maxLength)}…` : str
}
