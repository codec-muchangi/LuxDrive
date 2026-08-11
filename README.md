# LUXDRIVE — Luxury Car Rental Platform

> DRIVE THE EXTRAORDINARY

LUXDRIVE is a full-stack luxury car rental and booking platform built for the Kenyan market. Customers can discover, book, and pay for premium vehicles online. Administrators manage vehicles, bookings, customers, and payments through a dedicated dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python 3.11+ + FastAPI + Pydantic v2 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Security | Supabase RLS + FastAPI JWT middleware |
| Payments | M-Pesa (Daraja API) + Card |

---

## Project Structure

```
luxdrive/
├── frontend/          # React application
├── backend/           # FastAPI application
├── database/          # SQL migrations and seed data
├── docs/              # Project documentation
├── scripts/           # Utility scripts
├── .env.example       # Environment variable template
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works for development)

### 1. Clone & Setup Environment

```bash
git clone https://github.com/your-org/luxdrive.git
cd luxdrive
cp .env.example .env
# Fill in your .env values
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### 4. Database Setup

Run the migrations in order from `database/migrations/` in your Supabase SQL editor.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values.

**Never commit `.env` to Git.**

Frontend variables must be prefixed with `VITE_` to be exposed to the browser.

---

## Development Phases

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ | Project setup & scaffold |
| 2 | 🔄 | Supabase database schema |
| 3 | ⬜ | FastAPI backend foundation |
| 4 | ⬜ | React frontend foundation |
| 5 | ⬜ | Landing page |
| 6 | ⬜ | Cars listing + search + filter |
| 7 | ⬜ | Car details |
| 8 | ⬜ | Authentication |
| 9 | ⬜ | Booking system |
| 10 | ⬜ | Customer dashboard |
| 11 | ⬜ | Admin dashboard |
| 12 | ⬜ | Payment integration |
| 13 | ⬜ | Post-MVP features |
| 14 | ⬜ | Testing |
| 15 | ⬜ | Deployment |

---

## Security

- Supabase service-role key is **server-side only** (FastAPI)
- Payment secrets are **never** in frontend code
- Row Level Security (RLS) is enabled on all sensitive tables
- All prices calculated server-side — frontend prices are estimates only
- JWT tokens verified on every protected FastAPI endpoint

---

## Supported Luxury Brands

BMW · Mercedes-Benz · Porsche · Range Rover · Audi · Lexus · Jaguar · Maserati · Bentley

---

## License

Private — LUXDRIVE © 2026
