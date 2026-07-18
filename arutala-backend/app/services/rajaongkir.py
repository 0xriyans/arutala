import httpx
from app.core.config import settings

async def get_shipping_cost(destination_city_id: str, weight_grams: int, courier: str = "jne"):
    """
    Get shipping cost from RajaOngkir.
    """
    url = f"{settings.RAJAONGKIR_BASE_URL}/cost"
    headers = {
        "key": settings.RAJAONGKIR_API_KEY,
        "content-type": "application/x-www-form-urlencoded"
    }
    data = {
        "origin": settings.RAJAONGKIR_ORIGIN_CITY_ID,
        "destination": destination_city_id,
        "weight": weight_grams,
        "courier": courier
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, data=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": response.text}
