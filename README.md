# Inventory and Sales Management

Inventory and Sales Management is a full-stack web application for managing products, orders, sales, and users. This repo contains a Node/Express backend and a React (Vite) frontend.

## Features

- Product management (CRUD)
- Order and sale tracking
- User authentication and roles (admin, staff, user)
- File uploads for product images

## Repository structure

- `backend/` — Express server, API routes, models, middleware
- `frontend/` — React app (Vite)
- `uploads/` — uploaded files (images)

## Prerequisites

- Node.js 18+ and npm (or Yarn)
- MongoDB instance (local or cloud)

## Environment variables

Create a `.env` file in `backend/` with at least the following values:

- `PORT` — server port (e.g., 5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs

Example `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_jwt_secret_here
```

Do NOT commit `.env` or secrets — they are ignored by `.gitignore`.

## Installation

From the repository root, install backend and frontend dependencies.

1. Install backend dependencies

```bash
cd backend
npm install
```

2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running in development

Open two terminals (one for backend, one for frontend):

Backend

```bash
cd backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```

The frontend default Vite server (usually `http://localhost:5173`) should proxy or call the backend API at the backend `PORT` you set.

## Build for production

Build the frontend and deploy the static files behind your preferred host.

```bash
cd frontend
npm run build
```

Serve the `dist` output with a static host or integrate with the backend for server-side hosting.

## Notes

- Uploaded images are stored in `uploads/` — consider using cloud storage for production and exclude them from git.
- Add a `LICENSE` if you plan to open-source the code.

## Troubleshooting

- If you see connection errors, verify `MONGO_URI` and that MongoDB is reachable.
- For CORS issues, ensure the backend CORS settings allow the frontend origin in development.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request

---
Generated initial README and installation instructions.
