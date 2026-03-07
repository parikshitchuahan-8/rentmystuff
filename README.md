# RentMyStuff – Rental Marketplace

RentMyStuff is a full-stack rental marketplace where users can list products for rent and others can book them for specific dates.

## Features

User Authentication (JWT)

Add Products with Image Upload

Browse and Filter Products

Book Products for Specific Dates

Prevent Overlapping Bookings

Owner Booking Approval System

Owner Dashboard

Booking Cancellation

Responsive UI

## Tech Stack

### Frontend

React
TailwindCSS
Framer Motion
Axios

### Backend

Spring Boot
Spring Security
JWT Authentication
JPA / Hibernate

### Database

PostgreSQL

## API Endpoints

POST /api/auth/login
POST /api/products
GET /api/products
GET /api/products/{id}
POST /api/bookings
GET /api/bookings/my
GET /api/bookings/owner

## Installation

### Backend

```
cd backend
mvn spring-boot:run
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Author

Parikshit Chauhan
