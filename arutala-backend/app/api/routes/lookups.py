from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.product import FragranceFamily, Concentration, Volume

router = APIRouter()

@router.get("/families", response_model=List[dict], summary="Get fragrance families")
def get_families(session: Session = Depends(get_session)):
    """
    Retrieve a list of available fragrance families (e.g. Floral, Woody).
    """
    families = session.exec(select(FragranceFamily)).all()
    return [{"id": f.id, "name": f.name} for f in families]

@router.get("/concentrations", response_model=List[dict], summary="Get concentrations")
def get_concentrations(session: Session = Depends(get_session)):
    """
    Retrieve a list of available concentrations (e.g. EDP, EDT).
    """
    concentrations = session.exec(select(Concentration)).all()
    return [{"id": c.id, "name": c.name} for c in concentrations]

@router.get("/volumes", response_model=List[dict], summary="Get volumes")
def get_volumes(session: Session = Depends(get_session)):
    """
    Retrieve a list of available packaging volumes (e.g. 50ml, 100ml).
    """
    volumes = session.exec(select(Volume)).all()
    return [{"id": v.id, "name": v.name} for v in volumes]
