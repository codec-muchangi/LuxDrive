from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ─────────────────────────────────────────────────────────────────────────────
# Smart Auto Cars — FastAPI Application Entry Point
#
# This is the root of the backend application.
# Run locally with: uvicorn main:app --reload
# API docs available at: http://localhost:8000/docs
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Smart Auto Cars API",
    description="Vehicle rental platform — Nairobi, Kenya",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ────────────────────────────────────────────────────────────
# Allows the React frontend to make requests to this API.
# In production, replace "*" with your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    """Root endpoint — confirms the API is running."""
    return {
        "message": "Smart Auto Cars API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint.
    Used by the CI workflow and deployment platform to verify the service is up.
    Returns 200 OK when the application is healthy.
    """
    return {
        "status": "healthy",
        "service": "Smart Auto Cars API",
    }


# ── Future routers (added as we build each module) ────────────────────────────
# from app.routers import auth, vehicles, bookings, payments, tracking
# app.include_router(auth.router,      prefix="/api/v1/auth",     tags=["Auth"])
# app.include_router(vehicles.router,  prefix="/api/v1/vehicles", tags=["Vehicles"])
# app.include_router(bookings.router,  prefix="/api/v1/bookings", tags=["Bookings"])
# app.include_router(payments.router,  prefix="/api/v1/payments", tags=["Payments"])
# app.include_router(tracking.router,  prefix="/api/v1/tracking", tags=["Tracking"])
