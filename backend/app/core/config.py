"""
LUXDRIVE — Application Configuration
Loads and validates all environment variables using pydantic-settings.
A single Settings instance is created and reused everywhere via get_settings().
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """
    All application configuration loaded from environment variables.
    Pydantic validates types and raises clear errors on startup
    if a required variable is missing.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────
    APP_NAME:     str = "LUXDRIVE"
    APP_VERSION:  str = "1.0.0"
    APP_ENV:      str = Field(default="development")  # development | staging | production
    DEBUG:        bool = Field(default=True)

    # ── Supabase ─────────────────────────────────────────────
    SUPABASE_URL:              str
    SUPABASE_ANON_KEY:         str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET:       str

    # ── Security ─────────────────────────────────────────────
    SECRET_KEY:                    str = Field(min_length=32)
    ALGORITHM:                     str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:   int = 30

    # ── CORS ─────────────────────────────────────────────────
    FRONTEND_URL:    str = "http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = ""

    # ── Payment — M-Pesa ─────────────────────────────────────
    MPESA_CONSUMER_KEY:      str = ""
    MPESA_CONSUMER_SECRET:   str = ""
    MPESA_BUSINESS_SHORT_CODE: str = ""
    MPESA_PASSKEY:           str = ""
    MPESA_CALLBACK_URL:      str = ""
    MPESA_ENVIRONMENT:       str = "sandbox"    # sandbox | production

    # ── Payment — Card ───────────────────────────────────────
    STRIPE_SECRET_KEY:      str = ""
    STRIPE_WEBHOOK_SECRET:  str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""

    # ── Email ─────────────────────────────────────────────────
    EMAIL_API_KEY:      str = ""
    EMAIL_FROM_ADDRESS: str = "noreply@luxdrive.co.ke"
    EMAIL_FROM_NAME:    str = "LUXDRIVE"

    # ── Storage ───────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = 10

    # ── Booking Rules ─────────────────────────────────────────
    MIN_RENTAL_DAYS:             int   = 1
    MAX_RENTAL_DAYS:             int   = 90
    MIN_BOOKING_NOTICE_HOURS:    int   = 4
    PENDING_BOOKING_EXPIRY_MINUTES: int = 30

    # ── Tax ───────────────────────────────────────────────────
    TAX_RATE:         float = 0.16     # 16% VAT
    DEFAULT_CURRENCY: str   = "KES"

    # ── Rate Limiting ─────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60

    # ── Derived helpers ───────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"

    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse comma-separated origins string into a list."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    lru_cache ensures the .env file is read only once.
    Use this function everywhere instead of instantiating Settings directly.
    """
    return Settings()


# Convenience alias — import settings directly where preferred
settings = get_settings()
