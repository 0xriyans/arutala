from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

from app.db.session import get_session
from app.models.chat import ChatSession
from app.api.routes.auth import get_current_user

router = APIRouter()

class ChatHistoryUpdate(BaseModel):
    history: List[Dict[str, Any]]

@router.get("/history", summary="Get user chat history")
def get_chat_history(session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    """Retrieve the chat history for the currently authenticated user."""
    chat_session = session.exec(select(ChatSession).where(ChatSession.customer_id == str(current_user.id))).first()
    if chat_session:
        return {"history": chat_session.history}
    return {"history": []}

@router.post("/history", summary="Update user chat history")
def update_chat_history(data: ChatHistoryUpdate, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    """Save or update the chat history for the authenticated user."""
    chat_session = session.exec(select(ChatSession).where(ChatSession.customer_id == str(current_user.id))).first()
    
    if chat_session:
        chat_session.history = data.history
        chat_session.updated_at = datetime.utcnow()
    else:
        chat_session = ChatSession(
            customer_id=str(current_user.id),
            history=data.history
        )
        
    session.add(chat_session)
    session.commit()
    return {"message": "Chat history synced successfully"}
