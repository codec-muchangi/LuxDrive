"""
LUXDRIVE — Authentication Routes
/api/v1/auth/
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.dependencies import get_current_profile, require_active_account
from app.database.supabase import get_supabase_client
from pydantic import BaseModel, EmailStr

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────
class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    phone:     str | None = None
    avatar_url:str | None = None


# ── GET /auth/me ───────────────────────────────────────────────
@router.get("/me", summary="Get current user profile")
async def get_me(profile: dict = Depends(get_current_profile)):
    """
    Returns the authenticated user's LUXDRIVE profile.
    Called by the frontend AuthContext on every session init.
    """
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "data": {
                "id":             profile.get("id"),
                "user_id":        profile.get("user_id"),
                "full_name":      profile.get("full_name"),
                "phone":          profile.get("phone"),
                "avatar_url":     profile.get("avatar_url"),
                "role":           profile.get("role"),
                "account_status": profile.get("account_status"),
                "created_at":     profile.get("created_at"),
            }
        }
    )


# ── PATCH /auth/profile ────────────────────────────────────────
@router.patch("/profile", summary="Update current user profile")
async def update_profile(
    body: ProfileUpdateRequest,
    profile: dict = Depends(require_active_account),
):
    """
    Updates the current user's profile (name, phone, avatar).
    Role and account_status cannot be changed by the user.
    """
    client = get_supabase_client()

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "No fields to update.", "error_code": "EMPTY_UPDATE"},
        )

    try:
        result = (
            client.table("profiles")
            .update(update_data)
            .eq("id", profile["id"])
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "Failed to update profile.", "error_code": "UPDATE_FAILED"},
        )

    return JSONResponse(
        status_code=200,
        content={"success": True, "data": result.data, "message": "Profile updated successfully."}
    )
