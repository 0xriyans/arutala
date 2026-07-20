from typing import Optional, Dict, Any, List
import uuid
from sqlmodel import SQLModel, Field, Column, JSON, Relationship, Boolean, DateTime
from datetime import datetime

class FragranceNote(SQLModel, table=True):
    __tablename__ = "fragrance_note"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class ProductNoteLink(SQLModel, table=True):
    __tablename__ = "product_note_link"
    product_id: uuid.UUID = Field(foreign_key="product.id", primary_key=True)
    note_id: int = Field(foreign_key="fragrance_note.id", primary_key=True)
    # type can be 'top', 'heart', or 'base'
    type: str = Field(primary_key=True)

class FragranceFamily(SQLModel, table=True):
    __tablename__ = "fragrance_family"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: Optional[str] = None
    
    products: List["Product"] = Relationship(back_populates="fragrance_family")
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class Concentration(SQLModel, table=True):
    __tablename__ = "concentration"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class Volume(SQLModel, table=True):
    __tablename__ = "volume"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class Product(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    
    family_id: Optional[int] = Field(default=None, foreign_key="fragrance_family.id")
    fragrance_family: Optional[FragranceFamily] = Relationship(back_populates="products")
    
    subtitle: str
    description: str
    price: int
    images: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    isFeatured: bool = Field(default=False, sa_column=Column("is_featured", Boolean))
    showInShop: bool = Field(default=True, sa_column=Column("show_in_shop", Boolean))
    showInCollection: bool = Field(default=True, sa_column=Column("show_in_collection", Boolean))
    
    volume_id: Optional[int] = Field(default=None, foreign_key="volume.id")
    volume_rel: Optional[Volume] = Relationship()
    
    concentration_id: Optional[int] = Field(default=None, foreign_key="concentration.id")
    concentration_rel: Optional[Concentration] = Relationship()
    
    @property
    def family(self) -> str:
        return self.fragrance_family.name if self.fragrance_family else ""

    @property
    def volume(self) -> str:
        return self.volume_rel.name if self.volume_rel else ""

    @property
    def concentration(self) -> str:
        return self.concentration_rel.name if self.concentration_rel else ""
    
    story: str
    
    stock: int = Field(default=100)
    weight: int = Field(default=500) # in grams
    
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))
