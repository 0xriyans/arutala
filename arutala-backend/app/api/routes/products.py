import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict
from app.db.session import get_session
from app.models.product import Product, FragranceFamily, Volume, Concentration, FragranceNote, ProductNoteLink
from app.api.routes.auth import get_current_admin

router = APIRouter()

class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    slug: str
    name: str
    family: str
    subtitle: str
    description: str
    price: int
    images: Dict[str, Any]
    notes: Dict[str, Any]
    noteDescriptions: Dict[str, Any]
    volume: str
    concentration: str
    story: str
    isFeatured: bool
    showInShop: bool
    showInCollection: bool
    stock: int
    weight: int

def format_product_response(product: Product, session: Session):
    product_dict = product.dict()
    product_dict["family"] = product.family
    product_dict["volume"] = product.volume
    product_dict["concentration"] = product.concentration
    
    links = session.exec(select(ProductNoteLink).where(ProductNoteLink.product_id == product.id)).all()
    notes = {"top": [], "heart": [], "base": []}
    descriptions = {}
    for link in links:
        note = session.exec(select(FragranceNote).where(FragranceNote.id == link.note_id)).first()
        if note:
            if link.type not in notes:
                notes[link.type] = []
            notes[link.type].append(note.name)
            if note.description:
                descriptions[note.name] = note.description
                
    product_dict["notes"] = notes
    product_dict["noteDescriptions"] = descriptions
    return product_dict

@router.get("/", response_model=List[ProductResponse], summary="List all products")
def get_products(session: Session = Depends(get_session)):
    """
    Retrieve the entire boutique catalog of products that are not soft-deleted.
    """
    products = session.exec(select(Product).where(Product.deleted_at == None)).all()
    return [format_product_response(p, session) for p in products]

@router.get("/{slug}", response_model=ProductResponse, summary="Get product details")
def get_product(slug: str, session: Session = Depends(get_session)):
    """
    Retrieve full details of a specific fragrance or product by its unique slug.
    """
    product = session.exec(select(Product).where(Product.slug == slug).where(Product.deleted_at == None)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return format_product_response(product, session)

class ProductCreate(BaseModel):
    slug: str
    name: str
    family: str
    subtitle: str
    description: str
    price: int
    images: Dict[str, Any]
    notes: Dict[str, Any]
    noteDescriptions: Dict[str, Any]
    volume: str
    concentration: str
    story: str
    isFeatured: bool = False
    showInShop: bool = True
    showInCollection: bool = True

import base64
import os
import hashlib

def save_base64_image(b64_str: str) -> str:
    if not b64_str.startswith("data:image"):
        return b64_str
    
    try:
        header, encoded = b64_str.split(",", 1)
        h = hashlib.md5(encoded.encode()).hexdigest()[:10]
        filename = f"img_{h}.jpg"
        filepath = os.path.join("static", "images", filename)
        os.makedirs(os.path.join("static", "images"), exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(encoded))
        return f"/static/images/{filename}"
    except Exception as e:
        print("Failed to save base64 image", e)
        return b64_str

def process_images(images: dict) -> dict:
    if not images: return images
    new_images = {}
    for k, v in images.items():
        if isinstance(v, str) and v.startswith("data:image"):
            new_images[k] = save_base64_image(v)
        else:
            new_images[k] = v
    return new_images

def map_strings_to_ids(data_dict: dict, session: Session):
    if "family" in data_dict:
        f = session.exec(select(FragranceFamily).where(FragranceFamily.name == data_dict["family"])).first()
        if f: data_dict["family_id"] = f.id
        del data_dict["family"]
    if "volume" in data_dict:
        v = session.exec(select(Volume).where(Volume.name == data_dict["volume"])).first()
        if v: data_dict["volume_id"] = v.id
        del data_dict["volume"]
    if "concentration" in data_dict:
        c = session.exec(select(Concentration).where(Concentration.name == data_dict["concentration"])).first()
        if c: data_dict["concentration_id"] = c.id
        del data_dict["concentration"]

def sync_notes(product: Product, session: Session, notes: dict, descriptions: dict):
    # Sync JSON notes to FragranceNote and ProductNoteLink
    
    # Delete old links
    session.exec(text(f"DELETE FROM product_note_link WHERE product_id = '{product.id}'"))
    
    for note_type, note_list in notes.items():
        for note_name in note_list:
            if not note_name: continue
            
            existing = session.exec(select(FragranceNote).where(FragranceNote.name == note_name)).first()
            if not existing:
                new_note = FragranceNote(name=note_name, description=descriptions.get(note_name, None))
                session.add(new_note)
                session.commit()
                session.refresh(new_note)
                note_id = new_note.id
            else:
                note_id = existing.id
                
            link = ProductNoteLink(product_id=product.id, note_id=note_id, type=note_type)
            session.add(link)
    session.commit()

from sqlalchemy import text
@router.post("/", response_model=ProductResponse, summary="Create a new product")
def create_product(data: ProductCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Create a new product in the boutique catalog. Images are base64 encoded and saved locally. (Admin only)
    """
    data_dict = data.dict()
    if "images" in data_dict:
        data_dict["images"] = process_images(data_dict["images"])
    map_strings_to_ids(data_dict, session)
    
    notes = data_dict.pop("notes", {})
    descriptions = data_dict.pop("noteDescriptions", {})
    
    product = Product(**data_dict)
    session.add(product)
    session.commit()
    session.refresh(product)
    sync_notes(product, session, notes, descriptions)
    return format_product_response(product, session)

@router.put("/{slug}", response_model=ProductResponse, summary="Update a product")
def update_product(slug: str, data: ProductCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Update an existing product's details, including notes, images, and lookup fields. (Admin only)
    """
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    data_dict = data.dict()
    if "images" in data_dict:
        data_dict["images"] = process_images(data_dict["images"])
    map_strings_to_ids(data_dict, session)
    notes = data_dict.pop("notes", {})
    descriptions = data_dict.pop("noteDescriptions", {})
        
    for key, value in data_dict.items():
        setattr(product, key, value)
    session.add(product)
    session.commit()
    session.refresh(product)
    sync_notes(product, session, notes, descriptions)
    return format_product_response(product, session)

@router.delete("/{slug}", summary="Delete a product")
def delete_product(slug: str, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    """
    Soft-delete a product from the catalog so it no longer appears in the shop. (Admin only)
    """
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    from datetime import datetime
    product.deleted_at = datetime.utcnow()
    session.add(product)
    session.commit()
    return {"message": "Product deleted successfully"}
