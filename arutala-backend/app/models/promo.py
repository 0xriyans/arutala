from typing import Optional
import uuid
from sqlmodel import SQLModel, Field, Column, String, Boolean, DateTime
from datetime import datetime

class Promo(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    code: str = Field(unique=True, index=True)
    productSlug: Optional[str] = Field(default=None, sa_column=Column("product_slug", String))
    productName: Optional[str] = Field(default=None, sa_column=Column("product_name", String))
    minQuantity: int = Field(default=1, sa_column=Column("min_quantity", String))
    discountType: str = Field(default="percentage", sa_column=Column("discount_type", String))
    discountValue: int = Field(default=10, sa_column=Column("discount_value", String))
    description: Optional[str] = None
    isActive: bool = Field(default=True, sa_column=Column("is_active", Boolean))
    
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))
