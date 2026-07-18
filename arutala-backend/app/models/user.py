from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str
    role: str = Field(default="customer")
    address: Optional[str] = None
    city: Optional[str] = None
    postalCode: Optional[str] = None

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    passwordHash: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    createdAt: datetime

class UserLogin(SQLModel):
    email: str
    password: str

class UserProfileUpdate(SQLModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    postalCode: Optional[str] = None

class ChangePasswordRequest(SQLModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(SQLModel):
    email: str

class ResetPasswordRequest(SQLModel):
    token: str
    new_password: str

class GoogleLoginRequest(SQLModel):
    id_token: str
