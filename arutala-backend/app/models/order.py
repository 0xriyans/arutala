from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON
from datetime import datetime

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: Optional[int] = Field(default=None, foreign_key="user.id")
    date: datetime = Field(default_factory=datetime.utcnow)
    
    # Store snapshot of customer info
    customer_name: str
    customer_email: str
    customer_address: str
    customer_city: str
    customer_postalCode: str
    
    # Shipping info
    shipping_cost: int = Field(default=0)
    shipping_courier: str = Field(default="")
    
    # Payment info
    payment_token: Optional[str] = None
    payment_url: Optional[str] = None
    payment_status: str = Field(default="pending") # pending, settlement, expire, cancel
    
    items: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    total: int
    status: str = Field(default="Processing") # Processing, Shipped, Delivered, Cancelled

class OrderCreate(SQLModel):
    # Data expected from frontend during checkout
    customer_name: str
    customer_email: str
    customer_address: str
    customer_city: str
    customer_postalCode: str
    shipping_cost: int = 0
    shipping_courier: str = ""
    items: List[Dict[str, Any]]
    total: int
