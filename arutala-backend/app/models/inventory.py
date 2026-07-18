from typing import Optional
from sqlmodel import SQLModel, Field

class Inventory(SQLModel, table=True):
    product_slug: str = Field(primary_key=True)
    quantity: int = Field(default=0)
    low_stock_threshold: int = Field(default=5)
