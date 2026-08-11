"""
LUXDRIVE — FastAPI Application Entry Point

Configures and returns the FastAPI application instance.
All routers, middleware, CORS, and startup events are registered here.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.config import get_settings
from app.api.v1 import router as api_v1_router


# ── Lifespan (startup / shutdown) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown logic.
    Replaces the deprecated @app.on_event("startup") pattern.
    """
    settings = get_settings()
    print(f"\n{'='*50}")
    print(f"  LUXDRIVE API — {settings.APP_VERSION}")
    print(f"  Environment: {settings.APP_ENV}")
    print(f"  Supabase:    {settings.SUPABASE_URL[:40]}...")
    print(f"  CORS origins: {settings.allowed_origins_list}")
    print(f"{'='*50}\n")

    yield  # Application runs here

    # Shutdown
    print("\nLUXDRIVE API shutting down...")


# ── Create FastAPI app ─────────────────────────────────────────
def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="LUXDRIVE API",
        description="Luxury Car Rental Platform — Backend API",
        version=settings.APP_VERSION,
        # Hide docs in production for security
        docs_url="/docs"     if not settings.is_production else None,
        redoc_url="/redoc"   if not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── CORS Middleware ──────────────────────────────────────
    # Must be registered BEFORE routers
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Total-Count", "X-Page", "X-Page-Size"],
    )

    # ── Trusted Hosts (production hardening) ─────────────────
    if settings.is_production:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["luxdrive.co.ke", "*.luxdrive.co.ke", "api.luxdrive.co.ke"],
        )

    # ── API Routers ──────────────────────────────────────────
    app.include_router(api_v1_router, prefix="/api/v1")

    # ── Health Check ─────────────────────────────────────────
    @app.get("/health", tags=["System"])
    async def health_check():
        """
        Health check endpoint.
        Used by load balancers and monitoring services.
        """
        return JSONResponse(
            status_code=200,
            content={
                "status":  "healthy",
                "service": "LUXDRIVE API",
                "version": settings.APP_VERSION,
                "env":     settings.APP_ENV,
            }
        )

    @app.get("/", tags=["System"])
    async def root():
        return {
            "message": "LUXDRIVE API",
            "version": settings.APP_VERSION,
            "docs":    "/docs",
        }

    return app


# ── App instance ───────────────────────────────────────────────
app = create_app()
