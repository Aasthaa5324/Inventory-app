from pydantic import BaseModel
from typing import List
from datetime import datetime


# -------------------------
# Product Schemas
# -------------------------

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int


class ProductOut(ProductCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------------
# Customer Schemas
# -------------------------

class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str


class CustomerOut(CustomerCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------------
# Order Schemas
# -------------------------

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True