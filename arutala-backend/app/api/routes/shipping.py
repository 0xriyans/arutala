from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rajaongkir import get_shipping_cost, get_provinces, get_cities

router = APIRouter()

class ShippingRequest(BaseModel):
    destination_city_id: str
    weight_grams: int
    courier: str = "jne"

@router.get("/provinces", summary="Get all provinces")
async def fetch_provinces():
    """
    Fetch a list of all Indonesian provinces from RajaOngkir API.
    """
    return await get_provinces()

@router.get("/cities", summary="Get cities by province")
async def fetch_cities(province_id: str):
    """
    Fetch a list of cities/districts within a specific province from RajaOngkir API.
    """
    return await get_cities(province_id)

@router.post("/cost", summary="Calculate shipping cost")
async def calculate_shipping(req: ShippingRequest):
    """
    Calculate the shipping cost based on destination city, total weight, and selected courier.
    """
    result = await get_shipping_cost(req.destination_city_id, req.weight_grams, req.courier)
    return result
