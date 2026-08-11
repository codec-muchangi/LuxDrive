"""LUXDRIVE — Reviews Routes skeleton"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import require_active_account

router = APIRouter()

@router.post("/", summary="Create a review")
async def create_review(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "message": "Review creation coming in post-MVP phase."})
