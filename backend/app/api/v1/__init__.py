"""
LUXDRIVE — API v1 Router
Aggregates all route modules under /api/v1
"""

from fastapi import APIRouter
from app.api.v1.routes import auth, cars, bookings, payments, favorites, reviews, locations, admin

router = APIRouter()

# ── Public / Customer Routes ──────────────────────────────────
router.include_router(auth.router,      prefix="/auth",      tags=["Authentication"])
router.include_router(cars.router,      prefix="/cars",      tags=["Cars"])
router.include_router(bookings.router,  prefix="/bookings",  tags=["Bookings"])
router.include_router(payments.router,  prefix="/payments",  tags=["Payments"])
router.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
router.include_router(reviews.router,   prefix="/reviews",   tags=["Reviews"])
router.include_router(locations.router, prefix="/locations", tags=["Locations"])

# ── Admin Routes ──────────────────────────────────────────────
router.include_router(admin.router,     prefix="/admin",     tags=["Admin"])
