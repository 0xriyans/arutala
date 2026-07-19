from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import List
import uuid
from datetime import datetime

from app.db.session import get_session
from app.models.order import Order, OrderCreate, Courier
from app.models.enums import OrderStatus
from app.api.routes.auth import get_current_user, get_current_admin, get_current_user_optional
from app.services.midtrans import create_snap_transaction
from app.services.email import send_email_background, get_order_confirmation_html, get_shipping_notification_html
from app.core.config import settings

router = APIRouter()

from app.models.inventory import Inventory
import logging

logger = logging.getLogger(__name__)

@router.post("/", response_model=Order, summary="Create a new order")
def create_order(
    order: OrderCreate, 
    background_tasks: BackgroundTasks, 
    session: Session = Depends(get_session), 
    current_user = Depends(get_current_user_optional)
):
    """
    Submit a new order. This will deduct inventory, generate a Midtrans payment token, 
    and send an order confirmation email asynchronously.
    """
    # We will generate midtrans order_id after saving to DB to include the integer ID
    
    # 1. Create order in database
    courier = session.exec(select(Courier).where(Courier.name == order.shipping_courier)).first()
    
    new_order = Order(
        customer_id=current_user.id if current_user else None,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_address=order.customer_address,
        customer_city=order.customer_city,
        customer_postalCode=order.customer_postalCode,
        shipping_cost=order.shipping_cost,
        courier_id=courier.id if courier else None,
        total=order.total,
        status=OrderStatus.PROCESSING,
        items=[]
    )
    
    # 2. Add OrderItems
    from app.models.order import OrderItem
    for item in order.items:
        order_item = OrderItem(
            product_slug=item.get("productSlug", ""),
            product_name=item.get("productName", ""),
            price=item.get("price", 0),
            quantity=item.get("quantity", 1)
        )
        # Try to find product_id
        from app.models.product import Product
        prod = session.exec(select(Product).where(Product.slug == order_item.product_slug)).first()
        if prod:
            order_item.product_id = prod.id
        new_order.items.append(order_item)
    
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
        "phone": "08123456789",
        "shipping_address": {
            "first_name": order.customer_name,
            "email": order.customer_email,
            "phone": "08123456789",
            "address": order.customer_address,
            "city": order.customer_city,
            "postal_code": order.customer_postalCode[:10] if order.customer_postalCode else "",
            "country_code": "IDN"
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
        courier_name = "Courier"
        if new_order.courier_id:
            c = session.exec(select(Courier).where(Courier.id == new_order.courier_id)).first()
            if c: courier_name = c.name
            
        item_details.append({
            "id": "SHIPPING",
            "price": order.shipping_cost,
            "quantity": 1,
            "name": f"Shipping ({courier_name})"
        })
        
    session.add(new_order)
    session.commit()
    session.refresh(new_order)
    
    # Generate order_ref
    date_formatted = datetime.utcnow().strftime("%y%m%d")
    new_order.order_ref = f"INV-{date_formatted}-{str(new_order.id)[:8]}"
    
    # Generate midtrans order ID (must be under 50 chars)
    midtrans_order_id = f"ARUTALA-{new_order.order_ref}-{uuid.uuid4().hex[:4]}"
        
    midtrans_res = create_snap_transaction(midtrans_order_id, order.total, customer_details, item_details)
    print("MIDTRANS RES:", midtrans_res)
    
    if "error" not in midtrans_res:
        new_order.payment_token = midtrans_res.get("token")
        new_order.payment_url = midtrans_res.get("redirect_url")
    
    session.add(new_order)
    session.commit()
    session.refresh(new_order)
    
    # Send email notification
    payment_link = f"{settings.FRONTEND_URL}/#/payment?token={new_order.payment_token}&order_id={new_order.order_ref}"
    html_content = get_order_confirmation_html(new_order.order_ref, new_order.customer_name, new_order.total, payment_link)
    background_tasks.add_task(send_email_background, new_order.customer_email, new_order.customer_name, f"Order Received - {new_order.order_ref}", html_content)
    
    return new_order

@router.get("/", response_model=List[Order], summary="Get all orders")
def get_all_orders(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Retrieve all orders across the entire platform. (Admin only)
    """
    return session.exec(select(Order)).all()

@router.get("/me", response_model=List[Order], summary="Get my orders")
def get_my_orders(session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    """
    Retrieve the historical orders for the currently authenticated user.
    """
    return session.exec(select(Order).where(Order.customer_id == current_user.id)).all()

@router.put("/{order_id}/status", summary="Update order status")
async def update_order_status(
    order_id: uuid.UUID, 
    status: str, 
    session: Session = Depends(get_session),
    current_admin = Depends(get_current_admin)
):
    """
    Admin only: Update order status.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status.upper()
    session.add(order)
    session.commit()
    session.refresh(order)
    
    return order

class TrackingUpdate(BaseModel):
    tracking_number: str

@router.patch("/{order_id}/tracking")
async def update_tracking_number(
    order_id: uuid.UUID, 
    req: TrackingUpdate, 
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_admin = Depends(get_current_admin)
):
    """
    Admin only: Update tracking number and send email notification.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.tracking_number = req.tracking_number
    order.status = "SHIPPED"
    session.add(order)
    session.commit()
    session.refresh(order)
    
    # Send Shipping Email Notification
    courier_name = "Courier"
    if order.courier_id:
        c = session.exec(select(Courier).where(Courier.id == order.courier_id)).first()
        if c: courier_name = c.name
        
    html_content = get_shipping_notification_html(order.order_ref, order.customer_name, order.tracking_number, courier_name)
    background_tasks.add_task(send_email_background, order.customer_email, order.customer_name, f"Order Shipped - {order.order_ref}", html_content)
    
    return order

@router.get("/track/{order_ref}", response_model=Order, summary="Track order (Public)")
def track_order_public(order_ref: str, session: Session = Depends(get_session)):
    """
    Public endpoint to track an order by its reference or ID.
    """
    order = session.exec(select(Order).where(Order.order_ref == order_ref)).first()
    if not order and order_ref.isdigit():
        order = session.get(Order, int(order_ref))
        
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return order

@router.get("/{order_ref}", response_model=Order, summary="Get order by reference")
def get_order(order_ref: str, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    """
    Retrieve a specific order by its invoice reference string or integer ID.
    """
    order = session.exec(select(Order).where(Order.order_ref == order_ref)).first()
    # Fallback to id if not found (for compatibility)
    if not order and order_ref.isdigit():
        order = session.get(Order, int(order_ref))
        
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.customer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return order
