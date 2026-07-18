from sqlmodel import Session, text
from app.db.session import engine
session = Session(engine)
try:
    session.exec(text("ALTER TABLE product RENAME COLUMN showinshop TO \"showInShop\";"))
except Exception as e: print(e)
try:
    session.exec(text("ALTER TABLE product RENAME COLUMN showincollection TO \"showInCollection\";"))
except Exception as e: print(e)
session.commit()
print("ALTERED")
