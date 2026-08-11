"""LUXDRIVE — Cars Routes skeleton /api/v1/cars/"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/", summary="List all cars")
async def get_cars():
    return JSONResponse({"success": True, "data": [], "message": "Cars endpoint ready. Full implementation in Phase 6."})

@router.get("/featured", summary="Get featured cars")
async def get_featured_cars():
    return JSONResponse({"success": True, "data": []})

@router.get("/available", summary="Get available cars for dates")
async def get_available_cars():
    return JSONResponse({"success": True, "data": []})

@router.get("/{car_id}", summary="Get car by ID")
async def get_car(car_id: str):
    return JSONResponse({"success": True, "data": None, "message": f"Car {car_id} — implementation coming in Phase 6."})

@router.get("/{car_id}/reviews", summary="Get car reviews")
async def get_car_reviews(car_id: str):
    return JSONResponse({"success": True, "data": []})
