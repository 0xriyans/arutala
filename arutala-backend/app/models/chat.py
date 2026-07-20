from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_session"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: str = Field(index=True, unique=True, description="The ID of the user this chat belongs to")
    history: List[Dict[str, Any]] = Field(default=[], sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=datetime.utcnow)
