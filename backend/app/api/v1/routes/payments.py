"""LUXDRIVE — Payments Routes skeleton"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import require_active_account

router = APIRouter()

@router.post("/initiate", summary="Initiate payment")
async def initiate_payment(profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "message": "Payment initiation coming in Phase 12."})

@router.get("/{payment_id}", summary="Get payment status")
async def get_payment(payment_id: str, profile: dict = Depends(require_active_account)):
    return JSONResponse({"success": True, "data": None})

@router.post("/mpesa/callback", summary="M-Pesa payment webhook")
async def mpesa_callback():
    """M-Pesa Daraja API callback — no auth needed (provider-to-server)"""
    return JSONResponse({"ResultCode": 0, "ResultDesc": "Accepted"})

@router.post("/card/webhook", summary="Card payment webhook")
async def card_webhook():
    """Stripe/Card provider webhook — no auth needed (provider-to-server)"""
    return JSONResponse({"received": True})
