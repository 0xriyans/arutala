from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON
from datetime import datetime

class QuizLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    answers: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    recommendedProductSlug: str
