from typing import Optional, List, Dict, Any, TYPE_CHECKING
import uuid
from sqlmodel import SQLModel, Field, Column, JSON, Relationship, String, DateTime
from sqlalchemy import Enum
from datetime import datetime
from app.models.enums import OrderStatus, PaymentStatus

if TYPE_CHECKING:
    from app.models.product import Product

class Courier(SQLModel, table=True):
    __tablename__ = "courier"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: uuid.UUID = Field(foreign_key="order.id", index=True)
    product_id: Optional[uuid.UUID] = Field(default=None, foreign_key="product.id")
    
    product_name: str
    product_slug: str
    price: int
    quantity: int
    
    order: Optional["Order"] = Relationship(back_populates="items")
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class Order(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_ref: str = Field(default="", index=True) 
    customer_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", index=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    
    customer_name: str
    customer_email: str
    customer_address: str
    customer_city: str
    customer_postalCode: str = Field(sa_column=Column("customer_postal_code", String))
    
    shipping_cost: int = Field(default=0)
    courier_id: Optional[int] = Field(default=None, foreign_key="courier.id")
    tracking_number: Optional[str] = Field(default=None, index=True)
    
    payment_token: Optional[str] = None
    payment_url: Optional[str] = None
    payment_status: PaymentStatus = Field(
        default=PaymentStatus.PENDING,
        sa_column=Column(Enum(PaymentStatus, name="paymentstatus_enum", create_type=True), nullable=False)
    )
    
    total: int
    status: OrderStatus = Field(
        default=OrderStatus.PROCESSING,
        sa_column=Column(Enum(OrderStatus, name="orderstatus_enum", create_type=True), nullable=False)
    )
    
    items: List[OrderItem] = Relationship(back_populates="order", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class OrderCreate(SQLModel):
    customer_name: str
    customer_email: str
    customer_address: str
    customer_city: str
    customer_postalCode: str
    shipping_cost: int = 0
    shipping_courier: str = ""
    items: List[Dict[str, Any]]
    total: int

class OrderRead(SQLModel):
    id: uuid.UUID
    order_ref: str
    customer_id: Optional[uuid.UUID]
    date: datetime
    customer_name: str
    customer_email: str
    customer_address: str
    customer_city: str
    customer_postalCode: str
    shipping_cost: int
    courier_id: Optional[int] = None
    shipping_courier: str = ""
    tracking_number: Optional[str]
    payment_status: PaymentStatus
    total: int
    status: OrderStatus
    items: List[OrderItem]
