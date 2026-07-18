from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    family: str
    subtitle: str
    description: str
    price: int
    images: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    notes: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    noteDescriptions: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    volume: str
    concentration: str
    story: str
    isFeatured: bool = Field(default=False)
    showInShop: bool = Field(default=True)
    showInCollection: bool = Field(default=True)

