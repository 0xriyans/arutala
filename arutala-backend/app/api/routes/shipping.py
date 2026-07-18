from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rajaongkir import get_shipping_cost

router = APIRouter()

class ShippingRequest(BaseModel):
    destination_city_id: str
    weight_grams: int
    courier: str = "jne"

@router.post("/cost")
async def calculate_shipping(req: ShippingRequest):
    result = await get_shipping_cost(req.destination_city_id, req.weight_grams, req.courier)
    return result
