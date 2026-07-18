from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.db.session import get_session
from app.models.product import Product
from app.api.routes.auth import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[Product])
def get_products(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

@router.get("/{slug}", response_model=Product)
def get_product(slug: str, session: Session = Depends(get_session)):
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

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

@router.post("/", response_model=Product)
def create_product(data: ProductCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    data_dict = data.dict()
    if "images" in data_dict:
        data_dict["images"] = process_images(data_dict["images"])
    
    product = Product(**data_dict)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.put("/{slug}", response_model=Product)
def update_product(slug: str, data: ProductCreate, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    data_dict = data.dict()
    if "images" in data_dict:
        data_dict["images"] = process_images(data_dict["images"])
        
    for key, value in data_dict.items():
        setattr(product, key, value)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.delete("/{slug}")
def delete_product(slug: str, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True, "deleted": slug}

