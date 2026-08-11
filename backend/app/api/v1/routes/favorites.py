"""LUXDRIVE — Favorites Routes skeleton"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import require_active_account

router = APIRouter()

@router.get("/", summary="Get customer favorites")
async def get_favorites(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": []})

@router.post("/{car_id}", summary="Add car to favorites")
async def add_favorite(car_id: str, profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "message": "Added to favorites."})

@router.delete("/{car_id}", summary="Remove car from favorites")
async def remove_favorite(car_id: str, profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "message": "Removed from favorites."})
