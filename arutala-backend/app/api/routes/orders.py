from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
import uuid

from app.db.session import get_session
from app.models.order import Order, OrderCreate
from app.api.routes.auth import get_current_user, get_current_admin
from app.services.midtrans import create_snap_transaction

router = APIRouter()

from app.models.inventory import Inventory
import logging

logger = logging.getLogger(__name__)

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    order_id = str(uuid.uuid4()) # Generate a unique ID for Midtrans
    
    # 1. Create order in database
    new_order = Order(
        customer_id=current_user.id,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_address=order.customer_address,
        customer_city=order.customer_city,
        customer_postalCode=order.customer_postalCode,
        shipping_cost=order.shipping_cost,
        shipping_courier=order.shipping_courier,
        items=order.items,
        total=order.total,
        status="Processing"
    )
    
    # 2. Update Inventory and Check Low Stock
    for item in order.items:
        slug = item.get("productSlug")
        quantity = item.get("quantity", 1)
        if slug:
            inv_item = session.exec(select(Inventory).where(Inventory.product_slug == slug)).first()
            if inv_item:
                if inv_item.quantity < quantity:
                    # In a real app, maybe block order or allow backorder. We allow backorder.
                    inv_item.quantity -= quantity
                else:
                    inv_item.quantity -= quantity
                
                # Mock email notification
                if inv_item.quantity < inv_item.low_stock_threshold:
                    print(f"[EMAIL NOTIFICATION] Alert! Product '{slug}' stock is critically low ({inv_item.quantity} remaining). Please restock soon.")
                    logger.warning(f"Low stock alert for {slug}: {inv_item.quantity} left.")
                
                session.add(inv_item)

    # 3. Call Midtrans
    customer_details = {
        "first_name": order.customer_name,
        "email": order.customer_email,
        "shipping_address": {
            "first_name": order.customer_name,
            "address": order.customer_address,
            "city": order.customer_city,
            "postal_code": order.customer_postalCode
        }
    }
    
    # Map items to midtrans format
    item_details = []
    for item in order.items:
        item_details.append({
            "id": item.get('productSlug', 'item'),
            "price": item.get('price', 0),
            "quantity": item.get('quantity', 1),
            "name": item.get('productName', 'Product')[:50] # Midtrans limits name length
        })
    
    # Add shipping as an item
    if order.shipping_cost > 0:
        item_details.append({
            "id": "shipping",
            "price": order.shipping_cost,
            "quantity": 1,
            "name": f"Shipping ({order.shipping_courier})"
        })
        
    midtrans_res = create_snap_transaction(order_id, order.total, customer_details, item_details)
    
    if "error" not in midtrans_res:
        new_order.payment_token = midtrans_res.get("token")
        new_order.payment_url = midtrans_res.get("redirect_url")
    
    session.add(new_order)
    session.commit()
    session.refresh(new_order)
    
    # Note: the real ID will be auto-incremented integers if we use DB ID,
    # but Midtrans needs string ID. Usually we save the string ID in DB.
    # For now, we return the order with payment URL.
    return new_order

@router.get("/", response_model=List[Order])
def get_all_orders(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    return session.exec(select(Order)).all()

@router.get("/me", response_model=List[Order])
def get_my_orders(session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    return session.exec(select(Order).where(Order.customer_id == current_user.id)).all()
