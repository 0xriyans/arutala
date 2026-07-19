from typing import Optional
from sqlmodel import SQLModel, Field, Column, DateTime
from datetime import datetime

class Inventory(SQLModel, table=True):
    product_slug: str = Field(primary_key=True)
    quantity: int = Field(default=0)
    low_stock_threshold: int = Field(default=10)
    
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))
