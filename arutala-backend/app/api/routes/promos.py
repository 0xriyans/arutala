from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.promo import Promo

router = APIRouter()

@router.get("/", response_model=List[Promo])
def get_promos(session: Session = Depends(get_session)):
    return session.exec(select(Promo).where(Promo.isActive == True)).all()
