from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any

from app.db.session import get_session
from app.models.user import User
from app.models.order import Order
from app.models.inventory import Inventory
from app.api.routes.auth import get_current_admin

router = APIRouter()

@router.get("/users")
def get_all_users(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    users = session.exec(select(User)).all()
    # Calculate total spent for each user
    users_with_spend = []
    for user in users:
        orders = session.exec(select(Order).where(Order.customer_id == user.id)).all()
        total_spent = sum(order.total for order in orders)
        user_dict = user.dict(exclude={"passwordHash"})
        user_dict["total_orders"] = len(orders)
        user_dict["total_spent"] = total_spent
        users_with_spend.append(user_dict)
    
    return users_with_spend

@router.get("/orders")
def get_all_orders(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    return session.exec(select(Order).order_by(Order.date.desc())).all()

@router.get("/inventory")
def get_inventory(session: Session = Depends(get_session)):
    # Inventory can be public so frontend can check stock, or we can make it public.
    # Let's make it public so ProductDetailRoute can check it.
    items = session.exec(select(Inventory)).all()
    # Return as dict: slug -> quantity
    return {item.product_slug: {"quantity": item.quantity, "low_stock_threshold": item.low_stock_threshold} for item in items}

@router.put("/inventory/{slug}")
def update_inventory(slug: str, data: Dict[str, int], session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    item = session.exec(select(Inventory).where(Inventory.product_slug == slug)).first()
    if not item:
        item = Inventory(product_slug=slug, quantity=data.get("quantity", 0))
    else:
        if "quantity" in data:
            item.quantity = data["quantity"]
        if "low_stock_threshold" in data:
            item.low_stock_threshold = data["low_stock_threshold"]
            
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
