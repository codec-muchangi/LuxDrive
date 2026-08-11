"""LUXDRIVE — Admin Routes skeleton /api/v1/admin/"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import require_admin

router = APIRouter()

# ── Dashboard ─────────────────────────────────────────────────
@router.get("/analytics/dashboard", summary="Admin dashboard stats")
async def admin_dashboard(admin: dict = Depends(require_admin)):
    return JSONResponse({
        "success": True,
        "data": {
            "total_vehicles":    0,
            "available_vehicles":0,
            "active_rentals":    0,
            "total_customers":   0,
            "total_bookings":    0,
            "monthly_revenue":   0,
            "currency":          "KES",
        },
        "message": "Admin dashboard — full analytics in Phase 11."
    })

# ── Cars ──────────────────────────────────────────────────────
@router.post("/cars", summary="Create a new car")
async def create_car(admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": "Car creation coming in Phase 11."})

@router.put("/cars/{car_id}", summary="Update a car")
async def update_car(car_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": f"Car {car_id} update coming in Phase 11."})

@router.delete("/cars/{car_id}", summary="Disable/delete a car")
async def delete_car(car_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": "Car management coming in Phase 11."})

@router.post("/cars/{car_id}/images", summary="Upload car images")
async def upload_car_images(car_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": "Image upload coming in Phase 11."})

# ── Bookings ──────────────────────────────────────────────────
@router.get("/bookings", summary="Get all bookings")
async def get_all_bookings(admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "data": []})

@router.get("/bookings/{booking_id}", summary="Get booking detail")
async def get_booking(booking_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "data": None})

@router.patch("/bookings/{booking_id}/status", summary="Update booking status")
async def update_booking_status(booking_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": "Status management coming in Phase 11."})

# ── Customers ─────────────────────────────────────────────────
@router.get("/customers", summary="Get all customers")
async def get_customers(admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "data": []})

@router.get("/customers/{customer_id}", summary="Get customer detail")
async def get_customer(customer_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "data": None})

@router.patch("/customers/{customer_id}/status", summary="Update customer status")
async def update_customer_status(customer_id: str, admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "message": "Customer management coming in Phase 11."})

# ── Payments ──────────────────────────────────────────────────
@router.get("/payments", summary="Get all payments")
async def get_payments(admin: dict = Depends(require_admin)):
    return JSONResponse({"success": True, "data": []})
