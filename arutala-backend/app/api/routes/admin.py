from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any

from app.db.session import get_session
from app.models.user import User
from app.models.order import Order, OrderRead, Courier
from app.models.inventory import Inventory
from app.models.promo import Promo
from app.api.routes.auth import get_current_admin
from pydantic import BaseModel
import uuid

router = APIRouter()

@router.get("/users", summary="Get all users")
def get_all_users(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Retrieve all registered users and calculate their total orders and lifetime spent amount.
    Returns a list of users with spend metrics. (Admin only)
    """
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

@router.get("/orders", response_model=List[OrderRead], summary="Get all orders")
def get_all_orders(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Retrieve all historical orders across all customers, ordered by newest first. (Admin only)
    """
    return session.exec(select(Order).order_by(Order.date.desc())).all()

@router.get("/inventory", summary="Get inventory status")
def get_inventory(session: Session = Depends(get_session)):
    """
    Fetch the stock level and low stock threshold for all products.
    This is public so that the frontend can check stock availability before checkout.
    """
    # Inventory can be public so frontend can check stock, or we can make it public.
    # Let's make it public so ProductDetailRoute can check it.
    items = session.exec(select(Inventory)).all()
    # Return as dict: slug -> quantity
    return {item.product_slug: {"quantity": item.quantity, "low_stock_threshold": item.low_stock_threshold} for item in items}

@router.put("/inventory/{slug}", summary="Update inventory")
def update_inventory(slug: str, data: Dict[str, int], session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Update the current stock quantity and low stock threshold for a specific product. (Admin only)
    """
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

class PromoCreate(BaseModel):
    code: str
    productSlug: str
    productName: str
    minQuantity: int
    discountType: str
    discountValue: int
    description: str
    isActive: bool = True

@router.get("/promos", response_model=List[Promo], summary="Get all promotions")
def get_all_promos(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Retrieve a list of all quantity-based promotions or bulk discounts active in the system. (Admin only)
    """
    return session.exec(select(Promo).order_by(Promo.created_at.desc())).all()

@router.get("/couriers", response_model=List[Courier], summary="Get all couriers")
def get_all_couriers(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Retrieve a list of all available shipping couriers from the lookup table. (Admin only)
    """
    return session.exec(select(Courier).order_by(Courier.name)).all()

@router.post("/promos", response_model=Promo)
def create_promo(data: PromoCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    promo = Promo(
        code=data.code,
        productSlug=data.productSlug,
        productName=data.productName,
        minQuantity=data.minQuantity,
        discountType=data.discountType,
        discountValue=data.discountValue,
        description=data.description,
        isActive=data.isActive
    )
    session.add(promo)
    session.commit()
    session.refresh(promo)
    return promo

@router.put("/promos/{promo_id}", response_model=Promo)
def update_promo(promo_id: uuid.UUID, data: PromoCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    promo = session.get(Promo, promo_id)
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    
    promo.code = data.code
    promo.productSlug = data.productSlug
    promo.productName = data.productName
    promo.minQuantity = data.minQuantity
    promo.discountType = data.discountType
    promo.discountValue = data.discountValue
    promo.description = data.description
    promo.isActive = data.isActive
    
    session.add(promo)
    session.commit()
    session.refresh(promo)
    return promo

@router.delete("/promos/{promo_id}")
def delete_promo(promo_id: uuid.UUID, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    promo = session.get(Promo, promo_id)
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    
    session.delete(promo)
    session.commit()
    return {"message": "Promo deleted"}

class CourierCreate(BaseModel):
    name: str

@router.post("/couriers", response_model=Courier)
def create_courier(data: CourierCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    courier = Courier(name=data.name.upper())
    session.add(courier)
    session.commit()
    session.refresh(courier)
    return courier

@router.delete("/couriers/{courier_id}")
def delete_courier(courier_id: int, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    courier = session.get(Courier, courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    session.delete(courier)
    session.commit()
    return {"message": "Courier deleted"}

from app.models.product import FragranceFamily, Volume, Concentration, FragranceNote
from app.models.user import Role

class LookupCreate(BaseModel):
    name: str

@router.post("/lookups/{lookup_type}")
def create_lookup(lookup_type: str, data: LookupCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    model = None
    if lookup_type == "families":
        model = FragranceFamily
    elif lookup_type == "volumes":
        model = Volume
    elif lookup_type == "concentrations":
        model = Concentration
    elif lookup_type == "notes":
        model = FragranceNote
    elif lookup_type == "roles":
        model = Role
    else:
        raise HTTPException(status_code=400, detail="Invalid lookup type")
        
    new_item = model(name=data.name)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return {"id": new_item.id, "name": new_item.name}

@router.delete("/lookups/{lookup_type}/{item_id}")
def delete_lookup(lookup_type: str, item_id: int, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    model = None
    if lookup_type == "families":
        model = FragranceFamily
    elif lookup_type == "volumes":
        model = Volume
    elif lookup_type == "concentrations":
        model = Concentration
    elif lookup_type == "notes":
        model = FragranceNote
    elif lookup_type == "roles":
        model = Role
    else:
        raise HTTPException(status_code=400, detail="Invalid lookup type")
        
    item = session.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    session.delete(item)
    session.commit()
    return {"message": "Item deleted"}

@router.get("/lookups/notes")
def get_all_notes(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    notes = session.exec(select(FragranceNote).order_by(FragranceNote.name)).all()
    return [{"id": n.id, "name": n.name} for n in notes]

@router.get("/lookups/roles")
def get_all_roles(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    roles = session.exec(select(Role).order_by(Role.name)).all()
    return [{"id": r.id, "name": r.name} for r in roles]

