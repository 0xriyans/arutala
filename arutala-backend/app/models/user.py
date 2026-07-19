from typing import Optional, List
import uuid
from sqlmodel import SQLModel, Field, Relationship, Column, String, DateTime
from datetime import datetime

class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)

class UserAddress(SQLModel, table=True):
    __tablename__ = "user_address"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    label: str = Field(default="Home") 
    address: str
    city: str
    postalCode: str = Field(sa_column=Column("postal_code", String))
    is_default: bool = Field(default=False)
    
    user: Optional["User"] = Relationship(back_populates="addresses")
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str
    role: str = Field(default="customer")

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    passwordHash: str = Field(sa_column=Column("password_hash", String))
    createdAt: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime(timezone=True)))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime(timezone=True)))
    
    addresses: List[UserAddress] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID
    createdAt: datetime
    addresses: List[UserAddress] = []

class UserLogin(SQLModel):
    email: str
    password: str

class UserProfileUpdate(SQLModel):
    name: str

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
