from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.midtrans import create_snap_transaction
import json
import hashlib
from sqlmodel import Session, select
from fastapi import APIRouter, Request, HTTPException, Depends, BackgroundTasks
import hmac
from app.db.session import get_session
from app.models.order import Order
from app.models.product import Product
from app.core.config import settings
from app.services.email import send_email_background, get_payment_success_html, get_payment_failed_html

router = APIRouter()

class ItemDetail(BaseModel):
    id: str
    price: int
    quantity: int
    name: str

class CustomerDetail(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: str
    phone: str

class TokenizeRequest(BaseModel):
    order_id: str
    gross_amount: int
    customer_details: CustomerDetail
    item_details: List[ItemDetail]

@router.post("/tokenize")
async def tokenize_payment(req: TokenizeRequest):
    # Call Midtrans service
    result = create_snap_transaction(
        order_id=req.order_id,
        gross_amount=req.gross_amount,
        customer_details=req.customer_details.dict(exclude_none=True),
        item_details=[item.dict() for item in req.item_details]
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/notification")
async def payment_notification(request: Request, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    """
    Webhook endpoint for Midtrans to send payment status updates.
    """
    try:
        payload = await request.json()
        
        transaction_status = payload.get('transaction_status')
        order_id = payload.get('order_id')
        fraud_status = payload.get('fraud_status')
        gross_amount = payload.get('gross_amount')
        signature_key = payload.get('signature_key')
        
        # Verify signature
        server_key = settings.MIDTRANS_SERVER_KEY
        signature_data = f"{order_id}{payload.get('status_code')}{gross_amount}{server_key}"
        expected_signature = hashlib.sha512(signature_data.encode()).hexdigest()
        
        if signature_key != expected_signature:
            print("Invalid signature key received in Midtrans webhook")
            raise HTTPException(status_code=400, detail="Invalid signature")

        print(f"Received valid Midtrans notification for order {order_id} with status: {transaction_status}")
        
        status = 'pending'
        
        if transaction_status == 'capture':
            if fraud_status == 'challenge':
                status = 'pending'
            elif fraud_status == 'accept':
                status = 'paid'
        elif transaction_status == 'settlement':
            status = 'paid'
        elif transaction_status in ['cancel', 'deny', 'expire']:
            status = 'failed'
        elif transaction_status == 'pending':
            status = 'pending'
            
        # Parse DB order id from Midtrans order_id (Format: ARUTALA-{db_id}-{uuid})
        try:
            db_order_id = int(order_id.split('-')[1])
        except (IndexError, ValueError):
            print(f"Cannot parse db_order_id from {order_id}")
            return {"status": "error", "message": "Invalid order_id format"}
            
        order = session.get(Order, db_order_id)
        if order:
            # Check if status is actually changing to avoid duplicate emails
            status_changed = order.payment_status != status
            
            order.payment_status = status
            if status == 'paid':
                order.status = 'Processing'
                # Reduce Stock
                for item in order.items:
                    product_id = item.get("id") or item.get("productId")
                    if product_id:
                        product = session.get(Product, product_id)
                        if product:
                            product.stock = max(0, product.stock - item.get("quantity", 1))
                            session.add(product)
            elif status == 'failed':
                order.status = 'Cancelled'
            session.add(order)
            session.commit()
            print(f"Updated order {db_order_id} payment status to {status}")
            
            # Send Email if status changed
            if status_changed:
                if status == 'paid':
                    html_content = get_payment_success_html(order.order_ref, order.customer_name)
                    background_tasks.add_task(send_email_background, order.customer_email, order.customer_name, f"Payment Successful - {order.order_ref}", html_content)
                elif status == 'failed':
                    html_content = get_payment_failed_html(order.order_ref, order.customer_name)
                    background_tasks.add_task(send_email_background, order.customer_email, order.customer_name, f"Payment Failed - {order.order_ref}", html_content)
        else:
            print(f"Order {db_order_id} not found in database")
        
        return {"status": "ok"}
    except Exception as e:
        print(f"Error handling Midtrans webhook: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
