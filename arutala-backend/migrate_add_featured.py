"""Add isFeatured column to product table in PostgreSQL."""
from sqlalchemy import text
from app.db.session import engine

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE product ADD COLUMN "isFeatured" BOOLEAN DEFAULT FALSE'))
            conn.commit()
            print("[OK] Added isFeatured column to product table.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                print("[SKIP] isFeatured column already exists.")
            else:
                print(f"[ERROR] {e}")

if __name__ == "__main__":
    migrate()
