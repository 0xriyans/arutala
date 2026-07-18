from typing import Optional
from sqlmodel import SQLModel, Field

class Promo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(default="", index=True)
    productSlug: str
    productName: str
    minQuantity: int
    discountType: str
    discountValue: int
    description: str
    isActive: bool = Field(default=True)
