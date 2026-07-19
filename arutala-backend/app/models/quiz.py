from typing import Optional, Dict, Any, List
import uuid
from sqlmodel import SQLModel, Field, Column, JSON, String, DateTime
from datetime import datetime

class QuizLog(SQLModel, table=True):
    __tablename__ = "quiz_log"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    answers: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    recommendedProductSlug: Optional[str] = Field(default=None, sa_column=Column("recommended_product_slug", String))
    
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class QuizSubmit(SQLModel):
    answers: Dict[str, Any]
    recommendedProductSlug: Optional[str] = None
