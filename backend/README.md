# FNN Earth-42 API (Backend)

Hyperlocal AI-powered incident/disaster-management backend for FNN Earth-42.
Built with Node.js, Express 5, TypeScript, and Supabase PostgreSQL.

---

## Features

- **Root & API Health Checks**: `GET /health` and `GET /api/health`.
- **Supabase Authentication**: Bearer token authentication via `GET /api/me`.
- **Hyperlocal Geolocation**: 500m radius checks and Haversine distance calculations.
- **Incident Reporting & Staking**: Server-side credit checks and 10-credit stake locking via `POST /api/signals`.
- **Practical Duplicate Incident Detection**: Spatial and temporal duplicate detection (100m + 10-minute window).
- **Automated AI Triage & Severity Routing**: Deterministic classification into LOW, MEDIUM, HIGH, and CRITICAL severity workflows.
- **Hyperlocal Location Proof & Verification**: 500m proximity check, photo proof requirement, and atomic upvote/downvote tracking.
- **Hero & Task Management**: Obfuscated nearby hero discovery (`GET /api/heroes/nearby`), task acceptance, and valid lifecycle state transitions.
- **Auditable Escalations & SOS**: Dispatching serious incidents to `MOCK_AUTHORITY` with immutable audit logging and panic button support (`POST /api/sos`).
- **60-Second Privacy Challenge**: Automated TTL challenge window with simulated AI facial match and subject protection.
- **Public Emergency Services**: Verified local campus & emergency contacts (`GET /api/services`).
- **Security Hardening**: Helmet, CORS, centralized error handling, and Zod input validation.

---

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env` inside `backend/` and configure your Supabase project credentials:

```bash
PORT=5000
DATABASE_URL=postgresql://postgres.yourref:yourpass@aws-0-region.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://rbawqxsznvfoodpbdulh.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Run Automated End-to-End Test Suite

```bash
npx tsx src/test-e2e.ts
```

