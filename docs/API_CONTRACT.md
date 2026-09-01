# FNN EARTH-42 — Backend API Contract

Base URL: `http://localhost:5000` (or configured `PORT`)

All authenticated endpoints expect the standard Supabase access token in the header:
```http
Authorization: Bearer <supabase_access_token>
```

---

## 1. System & Health

### `GET /health`
- **Description**: Lightweight health check endpoint.
- **Auth**: None
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "service": "fnn-api"
}
```

### `GET /api/health`
- **Description**: Compatibility health check alias under `/api`.
- **Auth**: None
- **Response**: `200 OK`

---

## 2. Authentication & User Profile

### `GET /api/me`
- **Description**: Returns authenticated user profile and reputation.
- **Auth**: Required (`Bearer`)
- **Response**: `200 OK`
```json
{
  "id": "a0000000-0000-4000-8000-000000000002",
  "email": "karthik.student@vitchennai.demo",
  "pseudonym": "BlueJay21",
  "role": "STUDENT",
  "reputation": 8
}
```

---

## 3. Credits & Staking System

### `GET /api/credits`
- **Description**: Returns the authenticated user's wallet balance (available, locked, total) and transaction ledger.
- **Auth**: Required (`Bearer`)
- **Response**: `200 OK`
```json
{
  "balance": {
    "available": 40.00,
    "locked": 10.00,
    "total": 50.00
  },
  "transactions": [
    {
      "id": "bb000000-0000-4000-8000-000000000001",
      "userId": "a0000000-0000-4000-8000-000000000002",
      "signalId": "d0000000-0000-4000-8000-000000000001",
      "amount": 10.00,
      "type": "STAKE",
      "createdAt": "2026-09-01T18:00:00.000Z"
    }
  ]
}
```

---

## 4. Incident Reporting (Signals)

### `POST /api/signals`
- **Description**: Reports a new incident. Staking is verified & locked server-side. AI triage & duplicate checks run automatically.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "description": "Student feeling faint near Academic Block 1 corridor, needs first aid.",
  "category": "MEDICAL",
  "latitude": 12.84120,
  "longitude": 80.15410,
  "severity": "HIGH",
  "urgency": "IMMEDIATE",
  "stakeAmount": 10,
  "mediaUrl": "https://storage-url/image.jpg"
}
```
- **Response**: `201 Created`
```json
{
  "id": "d0000000-0000-4000-8000-000000000001",
  "reporterId": "a0000000-0000-4000-8000-000000000002",
  "reporterPseudonym": "BlueJay21",
  "description": "Student feeling faint near Academic Block 1 corridor, needs first aid.",
  "category": "MEDICAL",
  "severity": "HIGH",
  "urgency": "IMMEDIATE",
  "confidence": 0.90,
  "summary": "Student feeling faint near Academic Block 1 corridor, needs first aid.",
  "recommendedResponder": "Campus Security & First Aid Team",
  "latitude": 12.84120,
  "longitude": 80.15410,
  "status": "OPEN",
  "upvotes": 0,
  "downvotes": 0,
  "mediaUrls": ["https://storage-url/image.jpg"],
  "createdAt": "2026-09-01T18:00:00.000Z",
  "updatedAt": "2026-09-01T18:00:00.000Z"
}
```

### `GET /api/signals`
- **Description**: Lists recent signals (most recent first).
- **Auth**: None
- **Response**: `200 OK`
```json
{
  "signals": [...]
}
```

### `GET /api/signals/nearby`
- **Description**: Hyperlocal query for incidents within a specified radius (default: 500m).
- **Auth**: None
- **Query Parameters**:
  - `latitude` (number, required)
  - `longitude` (number, required)
  - `radius` (number in meters, optional, default: `500`)
- **Response**: `200 OK`
```json
{
  "signals": [
    {
      "id": "d0000000-0000-4000-8000-000000000001",
      "distanceMeters": 42.5,
      ...
    }
  ]
}
```

### `GET /api/signals/:id`
- **Description**: Retrieve a single signal by ID.
- **Auth**: None
- **Response**: `200 OK`

---

## 5. Location Proof & Hyperlocal Verification / Voting

### `POST /api/signals/:id/location-proof`
- **Description**: Submits photo proof that a user is physically at the incident site.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "mediaUrl": "https://storage-url/proof.jpg",
  "latitude": 12.84120,
  "longitude": 80.15410
}
```
- **Response**: `201 Created`
```json
{
  "message": "Location proof uploaded successfully",
  "proof": {
    "id": "e0000000-0000-4000-8000-000000000001",
    "signalId": "d0000000-0000-4000-8000-000000000001",
    "url": "https://storage-url/proof.jpg",
    "createdAt": "2026-09-01T18:05:00.000Z"
  }
}
```

### `POST /api/signals/:id/vote`
- **Description**: Submits an UP or DOWN verification vote. Validates that the voter is within 500m, has proof, is not the reporter, and has not voted previously.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "vote": "UP",
  "latitude": 12.84120,
  "longitude": 80.15410,
  "proofMediaId": "e0000000-0000-4000-8000-000000000001"
}
```
- **Response**: `200 OK`
```json
{
  "message": "Vote recorded successfully",
  "vote": "UP",
  "signal": {
    "id": "d0000000-0000-4000-8000-000000000001",
    "upvotes": 2,
    "downvotes": 0,
    "status": "VERIFIED",
    ...
  }
}
```

---

## 6. Heroes & Volunteer Task Management

### `GET /api/heroes/nearby`
- **Description**: Discovers available heroes nearby without exposing private exact coordinates.
- **Auth**: None
- **Query Parameters**:
  - `latitude` (number, required)
  - `longitude` (number, required)
  - `radius` (number in meters, optional, default: `1000`)
- **Response**: `200 OK`
```json
{
  "heroes": [
    {
      "id": "b0000000-0000-4000-8000-000000000001",
      "pseudonym": "FirstAidRahul",
      "skills": ["first-aid", "cpr", "crowd-control"],
      "availability": true,
      "reputation": 22,
      "distanceMeters": 85.3
    }
  ]
}
```

### `POST /api/tasks/:id/accept`
- **Description**: Assigned hero accepts a response task. Transitions task status from `ASSIGNED` to `ACCEPTED`.
- **Auth**: Required (`Bearer`)
- **Response**: `200 OK`
```json
{
  "id": "aa000000-0000-4000-8000-000000000001",
  "signalId": "d0000000-0000-4000-8000-000000000001",
  "heroId": "b0000000-0000-4000-8000-000000000001",
  "status": "ACCEPTED",
  "createdAt": "2026-09-01T18:10:00.000Z",
  "updatedAt": "2026-09-01T18:11:00.000Z"
}
```

### `PATCH /api/tasks/:id/status`
- **Description**: Enforces state progression: `ASSIGNED` → `ACCEPTED` → `RESPONDING` → `ARRIVED` → `RESOLVED`. When resolved, releases reporter stake and rewards hero with 15 credits.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "status": "RESOLVED"
}
```
- **Response**: `200 OK`

---

## 7. Escalation & SOS

### `POST /api/signals/:id/escalate`
- **Description**: Escalates high/critical incidents to `MOCK_AUTHORITY` with auditable logging.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "reason": "Electrical fire danger near entrance",
  "destination": "MOCK_AUTHORITY"
}
```
- **Response**: `200 OK`

### `POST /api/sos`
- **Description**: One-touch SOS emergency panic button. Creates CRITICAL/IMMEDIATE incident and dispatches mock escalation record immediately.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "latitude": 12.8406,
  "longitude": 80.1530,
  "note": "Immediate panic button trigger"
}
```
- **Response**: `201 Created`
```json
{
  "message": "Emergency SOS activated. Hyperlocal responders and emergency dispatch have been notified.",
  "signal": { ... },
  "escalation": {
    "id": "...",
    "destination": "MOCK_AUTHORITY (VIT Campus Security & Emergency Response)",
    "status": "SENT"
  }
}
```

---

## 8. 60-Second Privacy Challenge

### `POST /api/signals/:id/challenge`
- **Description**: Initiates a 60-second privacy challenge window for an incident photo.
- **Auth**: Required (`Bearer`)
- **Response**: `201 Created`
```json
{
  "id": "cc000000-0000-4000-8000-000000000001",
  "signalId": "d0000000-0000-4000-8000-000000000002",
  "userId": "a0000000-0000-4000-8000-000000000002",
  "status": "PENDING",
  "expiresAt": "2026-09-01T18:01:00.000Z",
  "matchConfidence": null,
  "createdAt": "2026-09-01T18:00:00.000Z"
}
```

### `POST /api/challenges/:id/selfie`
- **Description**: Submits selfie verification. If matched within 60 seconds, activates privacy lock to protect subject image from public exposure.
- **Auth**: Required (`Bearer`)
- **Request Body**:
```json
{
  "selfieUrl": "https://storage-url/selfie.jpg",
  "matchConfidence": 0.92,
  "matchResult": true
}
```
- **Response**: `200 OK`
```json
{
  "challenge": {
    "id": "cc000000-0000-4000-8000-000000000001",
    "status": "MATCHED",
    "matchConfidence": 0.92,
    ...
  },
  "message": "Identity verified. Privacy lock activated: incident details protected.",
  "privacyProtected": true
}
```

---

## 9. Public Services Directory

### `GET /api/services`
- **Description**: Returns verified emergency and campus contacts.
- **Auth**: None
- **Query Parameters**:
  - `category` (optional)
  - `search` (optional)
- **Response**: `200 OK`
```json
{
  "services": [
    {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "VIT Chennai Health Centre",
      "category": "MEDICAL",
      "phone": "044-3993-1555",
      "website": "https://chennai.vit.ac.in"
    }
  ]
}
```

---

## 10. Error Format

All error responses consistently return:
```json
{
  "error": {
    "message": "Detailed error explanation",
    "status": 400,
    "details": null
  }
}
```
- `400`: Bad Request (Invalid parameters or missing fields)
- `401`: Unauthorized (Missing or invalid Bearer token)
- `403`: Forbidden (Out of radius or not assigned hero)
- `404`: Not Found
- `409`: Conflict (Duplicate incident or duplicate vote)
- `410`: Gone / Expired (Privacy challenge 60s TTL expired)
- `500`: Internal Server Error
- `503`: Database Service Unavailable
