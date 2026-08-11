"""LUXDRIVE — Bookings Routes skeleton /api/v1/bookings/"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import require_active_account

router = APIRouter()

@router.post("/quote", summary="Get booking price quote")
async def get_quote(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": None, "message": "Quote endpoint ready. Full implementation in Phase 8."})

@router.post("/", summary="Create a booking")
async def create_booking(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": None, "message": "Booking creation coming in Phase 8."})

@router.get("/", summary="Get customer bookings")
async def get_bookings(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": []})

@router.get("/{booking_id}", summary="Get booking by ID")
async def get_booking(booking_id: str, profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": None})

@router.post("/{booking_id}/cancel", summary="Cancel a booking")
async def cancel_booking(booking_id: str, profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "message": "Cancellation coming in Phase 8."})
