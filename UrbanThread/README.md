# UrbanThread — Premium Modern E-Commerce Platform

This repository is structured into two main packages:

```
UrbanThread/
├── frontend/    # React + Vite + CSS Design System
└── backend/     # Node.js + Express + MongoDB REST API
```

## Quick Start

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs at `http://localhost:5174`)*

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
*(Runs at `http://localhost:5000`)*

> **Database:** Zero-config embedded MongoDB starts automatically if local MongoDB is not found. To use persistent storage, set `MONGO_URI` in `backend/.env`.

---

## Root Commands (from `UrbanThread/`)
- `npm run dev:frontend` — Start React frontend
- `npm run dev:backend` — Start Express API server
- `npm run build` — Build frontend for production
- `npm run seed:backend` — Re-seed backend database
