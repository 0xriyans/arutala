import httpx
from app.core.config import settings

# Timeout increased to 15 seconds for slow connections
TIMEOUT = 15.0

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
    
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.post(url, headers=headers, data=data)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": response.text}
    except httpx.TimeoutException:
        # Return mock shipping costs when API is unreachable
        return _mock_shipping_cost(courier)
    except Exception as e:
        return _mock_shipping_cost(courier)

async def get_provinces():
    url = f"{settings.RAJAONGKIR_BASE_URL}/province"
    headers = {
        "key": settings.RAJAONGKIR_API_KEY
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                return response.json()
            return _mock_provinces()
    except httpx.TimeoutException:
        return _mock_provinces()
    except Exception as e:
        return _mock_provinces()

async def get_cities(province_id: str):
    url = f"{settings.RAJAONGKIR_BASE_URL}/city"
    headers = {
        "key": settings.RAJAONGKIR_API_KEY
    }
    params = {
        "province": province_id
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.get(url, headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            return _mock_cities(province_id)
    except httpx.TimeoutException:
        return _mock_cities(province_id)
    except Exception as e:
        return _mock_cities(province_id)

# ============================================================
# Fallback / Mock data for when RajaOngkir API is unreachable
# ============================================================

def _mock_provinces():
    """Return commonly used provinces as fallback."""
    provinces = [
        {"province_id": "6", "province": "DKI Jakarta"},
        {"province_id": "9", "province": "Jawa Barat"},
        {"province_id": "10", "province": "Jawa Tengah"},
        {"province_id": "11", "province": "Jawa Timur"},
        {"province_id": "5", "province": "DI Yogyakarta"},
        {"province_id": "3", "province": "Banten"},
        {"province_id": "1", "province": "Bali"},
        {"province_id": "12", "province": "Kalimantan Barat"},
        {"province_id": "13", "province": "Kalimantan Selatan"},
        {"province_id": "14", "province": "Kalimantan Tengah"},
        {"province_id": "15", "province": "Kalimantan Timur"},
        {"province_id": "16", "province": "Kalimantan Utara"},
        {"province_id": "17", "province": "Kepulauan Bangka Belitung"},
        {"province_id": "18", "province": "Kepulauan Riau"},
        {"province_id": "19", "province": "Lampung"},
        {"province_id": "20", "province": "Maluku"},
        {"province_id": "21", "province": "Maluku Utara"},
        {"province_id": "22", "province": "Nusa Tenggara Barat"},
        {"province_id": "23", "province": "Nusa Tenggara Timur"},
        {"province_id": "24", "province": "Papua"},
        {"province_id": "25", "province": "Papua Barat"},
        {"province_id": "26", "province": "Riau"},
        {"province_id": "27", "province": "Sulawesi Barat"},
        {"province_id": "28", "province": "Sulawesi Selatan"},
        {"province_id": "29", "province": "Sulawesi Tengah"},
        {"province_id": "30", "province": "Sulawesi Tenggara"},
        {"province_id": "31", "province": "Sulawesi Utara"},
        {"province_id": "32", "province": "Sumatera Barat"},
        {"province_id": "33", "province": "Sumatera Selatan"},
        {"province_id": "34", "province": "Sumatera Utara"},
        {"province_id": "2", "province": "Bangka Belitung"},
        {"province_id": "4", "province": "Bengkulu"},
        {"province_id": "7", "province": "Gorontalo"},
        {"province_id": "8", "province": "Jambi"},
        {"province_id": "35", "province": "Aceh"},
    ]
    return {"rajaongkir": {"results": sorted(provinces, key=lambda x: x["province"])}}

def _mock_cities(province_id: str):
    """Return major cities per province as fallback."""
    cities_map = {
        "6": [  # DKI Jakarta
            {"city_id": "151", "city_name": "Jakarta Barat", "type": "Kota", "postal_code": "11220"},
            {"city_id": "152", "city_name": "Jakarta Pusat", "type": "Kota", "postal_code": "10540"},
            {"city_id": "153", "city_name": "Jakarta Selatan", "type": "Kota", "postal_code": "12230"},
            {"city_id": "154", "city_name": "Jakarta Timur", "type": "Kota", "postal_code": "13330"},
            {"city_id": "155", "city_name": "Jakarta Utara", "type": "Kota", "postal_code": "14140"},
        ],
        "9": [  # Jawa Barat
            {"city_id": "22", "city_name": "Bandung", "type": "Kota", "postal_code": "40111"},
            {"city_id": "23", "city_name": "Bandung", "type": "Kabupaten", "postal_code": "40311"},
            {"city_id": "54", "city_name": "Bekasi", "type": "Kota", "postal_code": "17121"},
            {"city_id": "55", "city_name": "Bekasi", "type": "Kabupaten", "postal_code": "17530"},
            {"city_id": "115", "city_name": "Depok", "type": "Kota", "postal_code": "16416"},
            {"city_id": "78", "city_name": "Bogor", "type": "Kota", "postal_code": "16119"},
            {"city_id": "79", "city_name": "Bogor", "type": "Kabupaten", "postal_code": "16911"},
            {"city_id": "468", "city_name": "Tasikmalaya", "type": "Kota", "postal_code": "46116"},
            {"city_id": "103", "city_name": "Cirebon", "type": "Kota", "postal_code": "45116"},
            {"city_id": "254", "city_name": "Karawang", "type": "Kabupaten", "postal_code": "41311"},
        ],
        "10": [  # Jawa Tengah
            {"city_id": "398", "city_name": "Semarang", "type": "Kota", "postal_code": "50135"},
            {"city_id": "399", "city_name": "Semarang", "type": "Kabupaten", "postal_code": "50511"},
            {"city_id": "445", "city_name": "Surakarta (Solo)", "type": "Kota", "postal_code": "57113"},
            {"city_id": "349", "city_name": "Pekalongan", "type": "Kota", "postal_code": "51122"},
            {"city_id": "463", "city_name": "Tegal", "type": "Kota", "postal_code": "52114"},
            {"city_id": "196", "city_name": "Kendal", "type": "Kabupaten", "postal_code": "51314"},
        ],
        "11": [  # Jawa Timur
            {"city_id": "444", "city_name": "Surabaya", "type": "Kota", "postal_code": "60119"},
            {"city_id": "255", "city_name": "Kediri", "type": "Kota", "postal_code": "64121"},
            {"city_id": "289", "city_name": "Malang", "type": "Kota", "postal_code": "65119"},
            {"city_id": "290", "city_name": "Malang", "type": "Kabupaten", "postal_code": "65163"},
            {"city_id": "409", "city_name": "Sidoarjo", "type": "Kabupaten", "postal_code": "61219"},
            {"city_id": "133", "city_name": "Gresik", "type": "Kabupaten", "postal_code": "61115"},
        ],
        "5": [  # DI Yogyakarta
            {"city_id": "501", "city_name": "Yogyakarta", "type": "Kota", "postal_code": "55111"},
            {"city_id": "419", "city_name": "Sleman", "type": "Kabupaten", "postal_code": "55511"},
            {"city_id": "39", "city_name": "Bantul", "type": "Kabupaten", "postal_code": "55711"},
            {"city_id": "135", "city_name": "Gunung Kidul", "type": "Kabupaten", "postal_code": "55812"},
            {"city_id": "210", "city_name": "Kulon Progo", "type": "Kabupaten", "postal_code": "55611"},
        ],
        "3": [  # Banten
            {"city_id": "455", "city_name": "Tangerang", "type": "Kota", "postal_code": "15111"},
            {"city_id": "456", "city_name": "Tangerang", "type": "Kabupaten", "postal_code": "15914"},
            {"city_id": "457", "city_name": "Tangerang Selatan", "type": "Kota", "postal_code": "15318"},
            {"city_id": "106", "city_name": "Cilegon", "type": "Kota", "postal_code": "42417"},
            {"city_id": "402", "city_name": "Serang", "type": "Kota", "postal_code": "42111"},
        ],
        "1": [  # Bali
            {"city_id": "114", "city_name": "Denpasar", "type": "Kota", "postal_code": "80227"},
            {"city_id": "17", "city_name": "Badung", "type": "Kabupaten", "postal_code": "80351"},
            {"city_id": "128", "city_name": "Gianyar", "type": "Kabupaten", "postal_code": "80511"},
            {"city_id": "453", "city_name": "Tabanan", "type": "Kabupaten", "postal_code": "82119"},
        ],
    }
    default_cities = [
        {"city_id": "999", "city_name": "Kota Utama", "type": "Kota", "postal_code": "00000"},
    ]
    return {"rajaongkir": {"results": cities_map.get(province_id, default_cities)}}

def _mock_shipping_cost(courier: str = "jne"):
    """Return realistic mock shipping costs."""
    return {
        "rajaongkir": {
            "results": [{
                "code": courier,
                "name": "Jalur Nugraha Ekakurir (JNE)",
                "costs": [
                    {
                        "service": "REG",
                        "description": "Layanan Reguler",
                        "cost": [{"value": 18000, "etd": "2-3", "note": ""}]
                    },
                    {
                        "service": "OKE",
                        "description": "Ongkos Kirim Ekonomis",
                        "cost": [{"value": 14000, "etd": "3-4", "note": ""}]
                    },
                    {
                        "service": "YES",
                        "description": "Yakin Esok Sampai",
                        "cost": [{"value": 28000, "etd": "1-1", "note": ""}]
                    }
                ]
            }]
        }
    }
