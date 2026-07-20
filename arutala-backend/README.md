# ⚙️ Arutala Core Backend API

[← Back to Main Repository README](../README.md)

The **Arutala Core Backend** is an enterprise-grade RESTful API service powering authentication, product catalog management, order processing, and administrative workflows.

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM & Database**: [SQLModel](https://sqlmodel.tiangolo.com/) (Pydantic + SQLAlchemy) & [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Server**: Uvicorn ASGI Server

## 🌟 Key Features

- **Authentication & RBAC**: Secure JWT-based registration, login, and Role-Based Access Control (`ADMIN` vs `USER`).
- **Product & Olfactory Catalog**: Complete product CRUD with complex many-to-many relationships for fragrance notes (`FragranceNote` and `ProductNoteLink`).
- **Order & OMS Engine**: Financial transaction tracking, order status progression (`PENDING`, `PAID`, `SHIPPED`), and static item price snapshots.
- **Admin Management API**: Backoffice analytics endpoints, stock updates, and sales aggregation.

## 📁 Directory Structure

```text
arutala-backend/
├── app/
│   ├── api/            # API Endpoints (auth, products, orders, admin)
│   ├── core/           # Security, JWT utilities, and environment settings
│   ├── db/             # Session factory and database connections
│   ├── models/         # SQLModel database schemas (User, Product, Order, FragranceNote)
│   └── main.py         # FastAPI application initialization & middleware
└── requirements.txt
```
