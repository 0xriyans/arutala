from fastapi import APIRouter
from app.api.routes import auth, products, orders, promos, shipping, admin, payments, lookups, quizzes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(promos.router, prefix="/promos", tags=["promos"])
api_router.include_router(shipping.router, prefix="/shipping", tags=["shipping"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(lookups.router, prefix="/lookups", tags=["lookups"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
