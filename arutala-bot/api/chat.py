from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import StreamingResponse
from services.bot_service import generate_chat_response, generate_chat_response_stream
import json

router = APIRouter()

class Message(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []
    customer_name: Optional[str] = None
    customer_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        reply = await generate_chat_response(request.message, request.history)
        return ChatResponse(response=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest):
    async def event_generator():
        try:
            async for chunk in generate_chat_response_stream(request.message, request.history, request.customer_name, request.customer_id):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
