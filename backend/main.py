from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas

from database import Base, SessionLocal, engine

app = FastAPI(title="Inventory Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Inventory API Running"}


# ====================================
# PRODUCTS
# ====================================

@app.post("/products")
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = models.Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(models.Product).all()


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not db_product:
        return {"error": "Product not found"}

    db_product.name = product.name
    db_product.sku = product.sku
    db_product.price = product.price
    db_product.quantity = product.quantity

    db.commit()
    db.refresh(db_product)

    return db_product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        return {"error": "Product not found"}

    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}


# ====================================
# CUSTOMERS
# ====================================

@app.post("/customers")
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):
    db_customer = models.Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


@app.get("/customers")
def get_customers(
    db: Session = Depends(get_db)
):
    return db.query(models.Customer).all()


# ====================================
# ORDERS
# ====================================

@app.post("/orders")
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db)
):
    total_amount = 0

    db_order = models.Order(
        customer_id=order.customer_id
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:

        product = db.query(models.Product).filter(
            models.Product.id == item.product_id
        ).first()

        if not product:
            continue

        amount = product.price * item.quantity
        total_amount += amount

        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.add(order_item)

        product.quantity -= item.quantity

    db_order.total_amount = total_amount

    db.commit()
    db.refresh(db_order)

    return db_order


@app.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(models.Order).all()


# ====================================
# DASHBOARD
# ====================================

@app.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):
    total_products = db.query(
        models.Product
    ).count()

    total_customers = db.query(
        models.Customer
    ).count()

    total_orders = db.query(
        models.Order
    ).count()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders
    }