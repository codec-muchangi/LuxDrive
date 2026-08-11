/**
 * LUXDRIVE — API Service Client
 *
 * Axios instance configured to communicate with the FastAPI backend.
 * Handles:
 *   - Base URL from environment
 *   - Automatic JWT token injection on every request
 *   - 401 handling (session expired → redirect to login)
 *   - 403 handling (insufficient permissions)
 *   - Consistent error formatting
 *   - Request/response logging in development
 */

import axios from 'axios'
import { supabase } from '@/lib/supabase'

// ── Create Axios Instance ──────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,           // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ── Request Interceptor ────────────────────────────────────────
// Automatically attaches the Supabase JWT token to every API request
api.interceptors.request.use(
  async (config) => {
    try {
      // Get current Supabase session
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (err) {
      // Could not get session — proceed without token
      // Protected routes will return 401 which is handled below
      if (import.meta.env.DEV) {
        console.warn('[LUXDRIVE API] Could not retrieve session:', err)
      }
    }

    // Dev logging
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ────────────────────────────────────────
api.interceptors.response.use(
  // Success — return the response data directly
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`)
    }
    return response
  },

  // Error — handle HTTP errors
  async (error) => {
    const { response, config } = error

    if (import.meta.env.DEV) {
      console.error(
        `[API] ❌ ${response?.status || 'Network Error'} ${config?.url}`,
        response?.data
      )
    }

    if (!response) {
      // Network error — server unreachable
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your connection.',
        status: null,
        code: 'NETWORK_ERROR',
      })
    }

    switch (response.status) {
      case 401:
        // Token expired or invalid — clear session and redirect to login
        await supabase.auth.signOut()
        // Only redirect if not already on auth pages
        if (!window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login?reason=session_expired'
        }
        break

      case 403:
        // Forbidden — user doesn't have permission
        return Promise.reject({
          message: response.data?.message || 'You do not have permission to perform this action.',
          status: 403,
          code: response.data?.error_code || 'FORBIDDEN',
          data: response.data,
        })

      case 404:
        return Promise.reject({
          message: response.data?.message || 'The requested resource was not found.',
          status: 404,
          code: 'NOT_FOUND',
          data: response.data,
        })

      case 409:
        return Promise.reject({
          message: response.data?.message || 'A conflict occurred with your request.',
          status: 409,
          code: response.data?.error_code || 'CONFLICT',
          data: response.data,
        })

      case 422:
        // FastAPI validation error
        return Promise.reject({
          message: 'Invalid data submitted. Please check your inputs.',
          status: 422,
          code: 'VALIDATION_ERROR',
          data: response.data,
          errors: response.data?.detail,
        })

      case 429:
        return Promise.reject({
          message: 'Too many requests. Please wait a moment before trying again.',
          status: 429,
          code: 'RATE_LIMIT_EXCEEDED',
        })

      case 500:
      default:
        return Promise.reject({
          message: response.data?.message || 'Something went wrong on our end. Please try again.',
          status: response.status,
          code: response.data?.error_code || 'SERVER_ERROR',
          data: response.data,
        })
    }

    return Promise.reject(error)
  }
)

export default api

// ── Named exports for specific domains ─────────────────────────
// These keep API calls organised by feature domain

export const authAPI = {
  me:           ()       => api.get('/api/v1/auth/me'),
  updateProfile:(data)   => api.patch('/api/v1/auth/profile', data),
}

export const carsAPI = {
  getAll:       (params) => api.get('/api/v1/cars', { params }),
  getById:      (id)     => api.get(`/api/v1/cars/${id}`),
  getAvailable: (params) => api.get('/api/v1/cars/available', { params }),
  getFeatured:  ()       => api.get('/api/v1/cars/featured'),
}

export const bookingsAPI = {
  getQuote:     (data)   => api.post('/api/v1/bookings/quote', data),
  create:       (data)   => api.post('/api/v1/bookings', data),
  getAll:       (params) => api.get('/api/v1/bookings', { params }),
  getById:      (id)     => api.get(`/api/v1/bookings/${id}`),
  cancel:       (id, data) => api.post(`/api/v1/bookings/${id}/cancel`, data),
}

export const paymentsAPI = {
  initiate:     (data)   => api.post('/api/v1/payments/initiate', data),
  getStatus:    (id)     => api.get(`/api/v1/payments/${id}`),
}

export const favoritesAPI = {
  getAll:       ()       => api.get('/api/v1/favorites'),
  add:          (carId)  => api.post(`/api/v1/favorites/${carId}`),
  remove:       (carId)  => api.delete(`/api/v1/favorites/${carId}`),
}

export const reviewsAPI = {
  getForCar:    (carId)  => api.get(`/api/v1/cars/${carId}/reviews`),
  create:       (data)   => api.post('/api/v1/reviews', data),
}

export const locationsAPI = {
  getAll:       ()       => api.get('/api/v1/locations'),
}

// Admin
export const adminCarsAPI = {
  create:       (data)   => api.post('/api/v1/admin/cars', data),
  update:       (id, data) => api.put(`/api/v1/admin/cars/${id}`, data),
  delete:       (id)     => api.delete(`/api/v1/admin/cars/${id}`),
  uploadImage:  (id, formData) =>
    api.post(`/api/v1/admin/cars/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const adminBookingsAPI = {
  getAll:       (params) => api.get('/api/v1/admin/bookings', { params }),
  getById:      (id)     => api.get(`/api/v1/admin/bookings/${id}`),
  updateStatus: (id, data) => api.patch(`/api/v1/admin/bookings/${id}/status`, data),
}

export const adminCustomersAPI = {
  getAll:       (params) => api.get('/api/v1/admin/customers', { params }),
  getById:      (id)     => api.get(`/api/v1/admin/customers/${id}`),
  updateStatus: (id, data) => api.patch(`/api/v1/admin/customers/${id}/status`, data),
}

export const adminPaymentsAPI = {
  getAll:       (params) => api.get('/api/v1/admin/payments', { params }),
}

export const adminAnalyticsAPI = {
  getDashboard: ()       => api.get('/api/v1/admin/analytics/dashboard'),
  getRevenue:   (params) => api.get('/api/v1/admin/analytics/revenue', { params }),
}
