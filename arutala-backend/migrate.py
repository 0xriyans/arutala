from sqlmodel import SQLModel, Session, select
from app.db.session import engine
from app.models.inventory import Inventory
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.models.promo import Promo
from app.models.quiz import QuizLog

def main():
    SQLModel.metadata.create_all(engine)
    print("Database tables created/updated.")
    
    # Initialize some stock if empty
    with Session(engine) as session:
        items = session.exec(select(Inventory)).all()
        if not items:
            print("Seeding initial inventory...")
            slugs = ["discovery-set", "rintik", "hening", "fajar", "senja", "kala", "amerta", "puspa", "rempah", "segara", "swarna", "aksara"]
            for slug in slugs:
                inv = Inventory(product_slug=slug, quantity=20, low_stock_threshold=5)
                session.add(inv)
            session.commit()
            print("Seeded inventory.")
        else:
            print("Inventory already exists.")

if __name__ == "__main__":
    main()
