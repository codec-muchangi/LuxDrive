"""
LUXDRIVE — Authentication & Authorization Dependencies

FastAPI dependencies used on protected endpoints.
Every protected route must use one of these dependencies.

Usage:
    from app.core.dependencies import get_current_profile, require_admin

    @router.get("/my-bookings")
    async def my_bookings(profile = Depends(require_active_customer)):
        ...

    @router.get("/admin/cars")
    async def admin_cars(profile = Depends(require_admin)):
        ...
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import get_settings
from app.database.supabase import get_supabase_client

# ── HTTP Bearer token extractor ────────────────────────────────
bearer_scheme = HTTPBearer(auto_error=False)


# ── Step 1: Extract and verify the JWT ────────────────────────
async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """
    Extracts the Supabase access token from the Authorization header,
    verifies its signature, and returns the authenticated user's UUID.

    Raises 401 if the token is missing, expired, or invalid.
    """
    settings = get_settings()

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Authentication is required.",
                "error_code": "AUTH_REQUIRED",
            },
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},  # Supabase doesn't use standard aud
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "message": "Invalid authentication token.",
                    "error_code": "INVALID_TOKEN",
                },
            )
        return user_id

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Authentication token is invalid or has expired.",
                "error_code": "TOKEN_EXPIRED",
            },
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── Step 2: Load the application profile ─────────────────────
async def get_current_profile(
    user_id: str = Depends(get_current_user_id),
) -> dict:
    """
    Loads the LUXDRIVE profile from the profiles table.
    The profile contains the application role and account status.

    Never trust role/status from the JWT — always load from DB.
    """
    client = get_supabase_client()

    try:
        result = (
            client.table("profiles")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Could not load user profile.",
                "error_code": "PROFILE_NOT_FOUND",
            },
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "User profile not found.",
                "error_code": "PROFILE_NOT_FOUND",
            },
        )

    return result.data


# ── Step 3: Role and status checks ───────────────────────────

async def require_active_account(
    profile: dict = Depends(get_current_profile),
) -> dict:
    """Ensures the account is ACTIVE (not suspended/disabled)."""
    if profile.get("account_status") != "ACTIVE":
        status_val = profile.get("account_status", "UNKNOWN")
        code_map = {
            "SUSPENDED":   "ACCOUNT_SUSPENDED",
            "DISABLED":    "ACCOUNT_DEACTIVATED",
        }
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": f"Your account is {status_val.lower()}. Please contact support.",
                "error_code": code_map.get(status_val, "ACCOUNT_INACTIVE"),
            },
        )
    return profile


async def require_customer(
    profile: dict = Depends(require_active_account),
) -> dict:
    """Requires an active CUSTOMER account."""
    if profile.get("role") not in ("CUSTOMER", "ADMIN"):
        # Admins can also access customer routes where needed
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Customer access required.",
                "error_code": "INSUFFICIENT_PERMISSIONS",
            },
        )
    return profile


async def require_admin(
    profile: dict = Depends(require_active_account),
) -> dict:
    """Requires an active ADMIN account. Rejects all other roles."""
    if profile.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "You do not have permission to perform this action.",
                "error_code": "INSUFFICIENT_PERMISSIONS",
            },
        )
    return profile


# ── Optional auth (public routes that enrich response if logged in) ──
async def get_optional_profile(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict | None:
    """
    Returns the profile if a valid token is present, otherwise None.
    Used on public routes that behave differently for authenticated users
    (e.g., showing favorites status on car listings).
    """
    if not credentials:
        return None
    try:
        user_id = await get_current_user_id(credentials)
        return await get_current_profile(user_id)
    except HTTPException:
        return None
