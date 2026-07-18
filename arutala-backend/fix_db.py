from sqlmodel import Session
from sqlalchemy import text
from app.db.session import engine

def fix():
    with Session(engine) as session:
        session.execute(text("DELETE FROM product WHERE slug = 'aksara'"))
        session.commit()
        print("Fixed database!")

if __name__ == "__main__":
    fix()
