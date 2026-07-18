from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
from sqlalchemy.pool import NullPool

# Fix URL for psycopg2 if needed
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Engine creation
engine = create_engine(
    db_url, 
    echo=False, 
    # check_same_thread is only needed for SQLite
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
    poolclass=NullPool
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
