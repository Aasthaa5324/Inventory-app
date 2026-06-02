# Inventory-app


## Overview

This project is a full-stack Inventory Management System built using FastAPI, React, SQLite, and Docker. It allows users to manage products, customers, and orders through a simple web interface.

## Features

### Product Management

* Add products
* View products
* Update product details
* Delete products

### Customer Management

* Add customers
* View customer records

### Order Management

* Create orders
* Track order history
* Automatic inventory quantity updates after order creation

### Dashboard

* Total Products
* Total Customers
* Total Orders

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

### Frontend

* React
* Axios
* Vite

### DevOps

* Docker
* Docker Compose
* Git & GitHub

## Project Structure

inventory-app/

├── backend/

│ ├── main.py

│ ├── models.py

│ ├── schemas.py

│ ├── database.py

│ └── Dockerfile

├── frontend/

│ ├── src/

│ ├── public/

│ └── package.json

├── docker-compose.yml

└── README.md

## API Endpoints

### Products

* GET /products
* POST /products
* PUT /products/{id}
* DELETE /products/{id}

### Customers

* GET /customers
* POST /customers

### Orders

* GET /orders
* POST /orders

### Dashboard

* GET /dashboard

## Running the Project

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker-compose up --build
```

## Screenshots

Add screenshots of:

* Dashboard
* Products Page
* Customers Page
* Orders Page

## Author

Astha Dwivedi
