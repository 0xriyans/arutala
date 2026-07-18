from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select

from app.core.config import settings
from app.api.main import api_router
from app.db.session import create_db_and_tables, engine
from app.models.user import User
from app.models.product import Product
from app.core.security import get_password_hash

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    # create_db_and_tables()
    # seed_mock_data()
    pass

def seed_mock_data():
    with Session(engine) as session:
        # Seed an admin user if not exists
        admin = session.exec(select(User).where(User.email == "admin@arutala.com")).first()
        if not admin:
            admin_user = User(
                email="admin@arutala.com",
                name="Arutala Admin",
                passwordHash=get_password_hash("admin123"),
                role="admin"
            )
            session.add(admin_user)
        
        # Seed some products if none exist
        products = session.exec(select(Product)).all()
        if not products:
            p1 = Product(
                slug="rintik", name="Rintik", family="Floral", 
                subtitle="The Nostalgia", description="A liquid memory...",
                price=499000, volume="100ml / 3.4 FL.OZ", concentration="Extrait de Parfum", story="...",
                images={"primary": "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138", "secondary": ""},
                notes={"top": ["Petrichor"], "heart": ["Green Tea"], "base": ["Clean Musk"]},
                noteDescriptions={"Petrichor": "Earthy perfume of dry soil"}
            )
            session.add(p1)
        
        session.commit()
