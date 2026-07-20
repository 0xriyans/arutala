import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Arutala API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "arutala-super-secret-key-change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./arutala.db")
    
    # RajaOngkir
    RAJAONGKIR_API_KEY: str = os.getenv("RAJAONGKIR_API_KEY", "")
    RAJAONGKIR_BASE_URL: str = os.getenv("RAJAONGKIR_BASE_URL", "https://api.rajaongkir.com/starter")
    RAJAONGKIR_ORIGIN_CITY_ID: str = os.getenv("RAJAONGKIR_ORIGIN_CITY_ID", "152")

    # Midtrans
    MIDTRANS_SERVER_KEY: str = os.getenv("MIDTRANS_SERVER_KEY", "")
    MIDTRANS_CLIENT_KEY: str = os.getenv("MIDTRANS_CLIENT_KEY", "")
    MIDTRANS_IS_PRODUCTION: bool = os.getenv("MIDTRANS_IS_PRODUCTION", "False").lower() == "true"

    # Google Client ID
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    
    # Email Settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # App Settings
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")
    
    # Shipping API
    RAJAONGKIR_API_KEY: str = os.getenv("RAJAONGKIR_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()
