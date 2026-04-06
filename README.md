# RentMyStuff

RentMyStuff is a full-stack rental marketplace for listing products, browsing available items, and managing date-based bookings with owner approval.

The project is split into:

- `frontend` - React + Vite client
- `backend/main` - Spring Boot API

## What It Does

- User registration and login with JWT authentication
- Product creation with image upload
- Product browsing, search, and price/category filtering
- Booking requests with overlap protection
- Owner approval and rejection workflow
- Booking cancellation and owner dashboard views
- Responsive, polished UI across the main user flow

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- Framer Motion
- React Router
- Axios

### Backend

- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

## Project Structure

```text
rentmystuff/
|-- frontend/               # React application
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   `-- pages/
|   `-- package.json
|
`-- backend/
    `-- main/               # Spring Boot application
        |-- src/main/java/com/example/rentmystuff/
        |   |-- auth/
        |   |-- booking/
        |   |-- product/
        |   |-- security/
        |   `-- user/
        |-- src/main/resources/
        |-- pom.xml
        `-- mvnw.cmd
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Uploaded files: `http://localhost:8080/uploads/...`

## Prerequisites

- Node.js 18+
- npm
- Java 21
- PostgreSQL running locally

## Backend Setup

1. Create a PostgreSQL database named `rentmyapp`.
2. Review backend config in:

```text
backend/main/src/main/resources/application-dev.yml
```

3. Start the API:

```powershell
cd backend/main
.\mvnw.cmd spring-boot:run
```

Notes:

- The app currently uses the `dev` profile in local testing.
- Uploaded product images are stored in the repo-level `uploads/` folder.
- If your local database username/password differ, update `application-dev.yml` before starting.

## Frontend Setup

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Start the client:

```powershell
npm run dev
```

Notes:

- The frontend currently calls the backend at `http://localhost:8080/api`.
- Static asset URLs are also currently built against `http://localhost:8080`.
- If you change backend host/port, update the frontend API config in `frontend/src/api/axios.js`.

## Build Commands

### Frontend

```powershell
cd frontend
npm run build
```

### Backend

```powershell
cd backend/main
.\mvnw.cmd test
```

## Main App Flows

### Authentication

- Register a standard user account
- Log in to receive a JWT
- Fetch the current user via `/api/users/current`

### Products

- Owners can create new listings with title, description, category, price, and image
- Visitors can browse products without logging in
- Owners can delete only their own products
- Products with booking history are protected from deletion

### Bookings

- Renters request a booking by selecting start and end dates
- The backend rejects overlapping requests
- Owners can approve or reject pending bookings
- Rejected bookings no longer block future date selection
- Renters can cancel their own pending or approved bookings

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/current`

### Products

- `GET /api/products`
- `GET /api/products/filter`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `GET /api/products/{id}/unavailable-dates`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/owner`
- `PUT /api/bookings/{id}/approve`
- `PUT /api/bookings/{id}/reject`
- `DELETE /api/bookings/{id}`

## Current Notes

- The backend `pom.xml` still contains duplicate dependency declarations that should be cleaned up.
- The frontend `frontend/README.md` is still the default Vite template and can be trimmed or replaced later.
- There are only minimal automated tests right now, so manual verification is still important after backend changes.

## Recommended Next Improvements

- Add targeted tests for auth, booking overlap, and product deletion rules
- Move local secrets and DB config fully out of `application-dev.yml`
- Add edit-product UI to match the backend update endpoint
- Add booking calendar-style disabled dates instead of simple overlap messaging
