# RentMyStuff

RentMyStuff is a full-stack rental marketplace where users can list products, upload images, and reserve items for specific dates.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Spring Boot 3, Spring Security, JWT, JPA
- Database: PostgreSQL

## Core Features

- JWT authentication
- Product listing with image upload
- Product browsing and filtering
- Reservation flow with overlap protection
- Owner approval dashboard
- Booking cancellation
- Responsive UI

## Project Layout

- `frontend`: Vite React client
- `backend/main`: Spring Boot API

## Local Development

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Backend

```bash
cd backend/main
cp .env.example .env
./mvnw spring-boot:run
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

## Environment Variables

### Frontend

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ASSET_BASE_URL=http://localhost:8080
```

### Backend

Create `backend/main/.env`:

```bash
SPRING_PROFILES_ACTIVE=prod
PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/rentmyapp
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=replace-with-a-long-random-base64-secret
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads
JPA_DDL_AUTO=validate
```

## Deployment Notes

The repo is now set up so the frontend and backend can be deployed separately.

### Frontend deployment

- Set `VITE_API_BASE_URL` to your deployed backend API, for example `https://api.example.com/api`
- Set `VITE_ASSET_BASE_URL` to your backend origin, for example `https://api.example.com`
- Build command: `npm run build`
- Output directory: `dist`

### Backend deployment

- Set `SPRING_PROFILES_ACTIVE=prod`
- Provide `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET`
- Set `CORS_ALLOWED_ORIGINS` to your deployed frontend URL
- If you deploy with Docker, use `backend/main/Dockerfile`

### Docker

For a containerized backend plus Postgres locally:

```bash
cd backend/main
docker compose up --build
```

## Build Checks

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend/main
./mvnw -DskipTests compile
```
