import enum
from sqlmodel import SQLModel, Field, Relationship

class OrderStatus(str, enum.Enum):
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SETTLEMENT = "SETTLEMENT"
    EXPIRE = "EXPIRE"
    CANCEL = "CANCEL"

