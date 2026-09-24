// ─────────────────────────────────────────────────────────────────────────────
// Route constants — single source of truth for all URL paths.
// Import ROUTES wherever you need to navigate or build a link.
// Changing a path here updates it everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTES = {
  // Public
  HOME:             "/",

  // Auth
  LOGIN:            "/login",
  REGISTER:         "/register",
  FORGOT_PASSWORD:  "/forgot-password",
  RESET_PASSWORD:   "/reset-password",
  VERIFY_EMAIL:     "/verify-email",

  // Customer (protected)
  CARS:             "/cars",
  CAR_DETAIL:       "/cars/:id",
  DASHBOARD:        "/dashboard",
  BOOKINGS:         "/bookings",
  ACTIVE_RENTAL:    "/active-rental",
  PAYMENTS:         "/payments",
  PROFILE:          "/profile",
  SETTINGS:         "/settings",

  // Owner (protected)
  OWNER_DASHBOARD:  "/owner/dashboard",
  OWNER_VEHICLES:   "/owner/vehicles",
  OWNER_EARNINGS:   "/owner/earnings",

  // Admin (protected)
  ADMIN_DASHBOARD:  "/admin/dashboard",
}
