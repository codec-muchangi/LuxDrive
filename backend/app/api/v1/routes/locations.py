"""LUXDRIVE — Locations Routes skeleton"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/", summary="Get all active locations")
async def get_locations():
    return JSONResponse({"success": True, "data": [], "message": "Locations coming in Phase 6."})
