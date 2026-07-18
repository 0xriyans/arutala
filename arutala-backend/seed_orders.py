"""
Seed script to populate dummy orders and users into the database.
Run with: venv\Scripts\python seed_orders.py
"""
from sqlmodel import SQLModel, Session, select
from app.db.session import engine
from app.models.order import Order
from app.models.user import User
from app.models.inventory import Inventory
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random
import json

def seed():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # ─── 1. Seed Users ───
        existing_users = session.exec(select(User)).all()
        user_ids = [u.id for u in existing_users]

        dummy_users = [
            {"email": "admin@arutala.com", "name": "Arutala Admin", "role": "admin", "password": "admin123"},
            {"email": "rina@gmail.com", "name": "Rina Sari", "role": "customer", "password": "user123"},
            {"email": "budi@gmail.com", "name": "Budi Hartono", "role": "customer", "password": "user123"},
            {"email": "ayu@gmail.com", "name": "Ayu Lestari", "role": "customer", "password": "user123"},
            {"email": "dewi@gmail.com", "name": "Dewi Anggraini", "role": "customer", "password": "user123"},
            {"email": "hendra@gmail.com", "name": "Hendra Kusuma", "role": "customer", "password": "user123"},
            {"email": "siti@gmail.com", "name": "Siti Nurhaliza", "role": "customer", "password": "user123"},
        ]

        for u_data in dummy_users:
            existing = session.exec(select(User).where(User.email == u_data["email"])).first()
            if not existing:
                new_user = User(
                    email=u_data["email"],
                    name=u_data["name"],
                    role=u_data["role"],
                    passwordHash=get_password_hash(u_data["password"])
                )
                session.add(new_user)
        
        session.commit()
        # Refresh user list
        all_users = session.exec(select(User).where(User.role == "customer")).all()
        customer_ids = [u.id for u in all_users]
        customer_map = {u.id: u for u in all_users}

        if not customer_ids:
            print("No customer users found, aborting order seed.")
            return

        # ─── 2. Seed Dummy Orders ───
        existing_orders = session.exec(select(Order)).all()
        if len(existing_orders) > 0:
            print(f"Already {len(existing_orders)} orders in DB. Skipping order seed.")
        else:
            product_catalog = [
                {"slug": "rintik", "name": "Rintik", "price": 3200000},
                {"slug": "hening", "name": "Hening", "price": 3200000},
                {"slug": "fajar", "name": "Fajar", "price": 3400000},
                {"slug": "senja", "name": "Senja", "price": 3400000},
                {"slug": "kala", "name": "Kala", "price": 3600000},
                {"slug": "amerta", "name": "Amerta", "price": 3000000},
                {"slug": "puspa", "name": "Puspa", "price": 2800000},
                {"slug": "rempah", "name": "Rempah", "price": 3100000},
                {"slug": "segara", "name": "Segara", "price": 3300000},
                {"slug": "swarna", "name": "Swarna", "price": 3500000},
                {"slug": "aksara", "name": "Aksara", "price": 2900000},
                {"slug": "discovery-set", "name": "Discovery Set", "price": 1500000},
            ]

            cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali", "Semarang", "Malang", "Medan"]
            statuses = ["Processing", "Shipped", "Delivered", "Delivered", "Delivered"]  # More delivered for realism

            now = datetime.utcnow()

            for i in range(25):
                cust_id = random.choice(customer_ids)
                cust = customer_map[cust_id]
                
                # Random date in the last 30 days
                order_date = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
                
                # 1-3 items per order
                num_items = random.randint(1, 3)
                chosen_products = random.sample(product_catalog, min(num_items, len(product_catalog)))
                
                items = []
                order_total = 0
                for prod in chosen_products:
                    qty = random.randint(1, 2)
                    items.append({
                        "productSlug": prod["slug"],
                        "productName": prod["name"],
                        "quantity": qty,
                        "price": prod["price"]
                    })
                    order_total += prod["price"] * qty
                
                shipping_cost = random.choice([0, 15000, 25000, 35000])
                order_total += shipping_cost

                new_order = Order(
                    customer_id=cust_id,
                    customer_name=cust.name,
                    customer_email=cust.email,
                    customer_address=f"Jl. {random.choice(['Sudirman', 'Thamrin', 'Gatot Subroto', 'Merdeka', 'Pahlawan', 'Asia Afrika'])} No. {random.randint(1, 200)}",
                    customer_city=random.choice(cities),
                    customer_postalCode=str(random.randint(10000, 99999)),
                    shipping_cost=shipping_cost,
                    shipping_courier=random.choice(["JNE", "J&T", "SiCepat", "AnterAja"]),
                    items=items,
                    total=order_total,
                    status=random.choice(statuses),
                    date=order_date,
                    payment_status=random.choice(["settlement", "settlement", "settlement", "pending"]),
                )
                session.add(new_order)
            
            session.commit()
            print("[OK] Seeded 25 dummy orders.")

        # ─── 3. Update inventory to reflect sold items ───
        orders = session.exec(select(Order)).all()
        # Reset inventory to 20 first
        for slug in ["discovery-set", "rintik", "hening", "fajar", "senja", "kala", "amerta", "puspa", "rempah", "segara", "swarna", "aksara"]:
            inv = session.exec(select(Inventory).where(Inventory.product_slug == slug)).first()
            if inv:
                inv.quantity = 20  # reset
                session.add(inv)
        session.commit()

        # Then deduct based on delivered/shipped orders
        for order in orders:
            if order.status in ["Delivered", "Shipped", "Processing"]:
                for item in order.items:
                    slug = item.get("productSlug")
                    qty = item.get("quantity", 1)
                    if slug:
                        inv = session.exec(select(Inventory).where(Inventory.product_slug == slug)).first()
                        if inv:
                            inv.quantity = max(0, inv.quantity - qty)
                            session.add(inv)
        session.commit()
        
        # Make 1-2 products have low stock for demo
        low_stock_slugs = ["rintik", "swarna"]
        for slug in low_stock_slugs:
            inv = session.exec(select(Inventory).where(Inventory.product_slug == slug)).first()
            if inv:
                inv.quantity = random.randint(2, 4)  # below threshold of 5
                session.add(inv)
        session.commit()

        print("[OK] Inventory updated based on orders. 'rintik' and 'swarna' set to low stock for demo.")
        
        # Summary
        final_orders = session.exec(select(Order)).all()
        final_users = session.exec(select(User)).all()
        final_inv = session.exec(select(Inventory)).all()
        print(f"\n[DB] Database Summary:")
        print(f"   Users: {len(final_users)}")
        print(f"   Orders: {len(final_orders)}")
        print(f"   Inventory items: {len(final_inv)}")
        for inv in final_inv:
            status = "[!] LOW" if inv.quantity < inv.low_stock_threshold else "[OK]"
            print(f"     {inv.product_slug}: {inv.quantity} units [{status}]")

if __name__ == "__main__":
    seed()
