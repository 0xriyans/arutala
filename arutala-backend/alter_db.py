from sqlmodel import Session, text
from app.db.session import engine
session = Session(engine)
session.exec(text("ALTER TABLE product ADD COLUMN IF NOT EXISTS showInShop BOOLEAN DEFAULT true;"))
session.exec(text("ALTER TABLE product ADD COLUMN IF NOT EXISTS showInCollection BOOLEAN DEFAULT true;"))
session.commit()
print("ALTERED")
