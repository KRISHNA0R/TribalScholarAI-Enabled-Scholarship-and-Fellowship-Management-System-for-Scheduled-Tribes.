# 🎓 TribalScholar AI

### AI-Enabled Scholarship & Fellowship Management System for Scheduled Tribes

**SIH 2026 Project • Owner / Developer: Krishna R**

---

## 📌 Project Overview

**TribalScholar AI** is an end-to-end, AI-assisted digital platform for managing the scholarship and fellowship lifecycle of Scheduled Tribe (ST) students in India. It is a full-stack application: a React (Vite) single-page frontend, a Node.js/Express REST API, and a MongoDB database.

The system addresses common problems in traditional scholarship administration — document fraud, duplicate claims, inconsistent scrutiny, delays, and non-transparent disbursals — by combining document intelligence (OCR extraction, SHA-256 file hashing, anomaly flags), a configurable rule engine, composite merit ranking, and simulated Aadhaar Payment Bridge (APBS) Direct Benefit Transfer reconciliation in one portal.

**Important:** all AI/OCR/DBT/SMS behaviour in this codebase operates in **demo mode** with synthetic data. OCR extraction, eligibility scoring, anomaly detection, UTR generation, and outbound notifications are deterministic simulations implemented in `server/services/ai/` and `server/services/notificationService.js`. Human officers make every final approval decision.

---

## 🌟 Major Features

### 1. 10-Step Smart Application Wizard
- Guided, autosaving stepper capturing personal, socio-demographic, academic, and DBT bank account details.
- Simulated document upload with OCR preview that populates fields with confidence scores.
- Aadhaar e-KYC & domicile fields with masked identity display (`XXXX-XXXX-8921` style).

### 2. Officer Scrutiny & AI-Assisted Verification
- Dual queues: *AI Fast-Track (high confidence)* vs. *Manual Scrutiny Required (discrepancies/anomalies)*.
- Side-by-side review of document scan, extracted values, and automated discrepancy flags.
- Levenshtein-based field similarity scoring and duplicate-document detection via SHA-256 hashes.
- Officers raise targeted deficiency remediation notices to applicants.

### 3. Eligibility & Document Verification
- Rule-based eligibility evaluation against scheme parameters (income ceilings, education level, minimum percentage).
- Document classification and validation per scheme's required document list (ST certificate, income certificate, bonafide, marksheets, etc.).

### 4. Merit / Selection Workflow
- Four-factor composite merit score (out of 100): academic performance, research/premier-institute admission, scheme-specific fit, and special vulnerability (PVTG).
- Committee scoring, voting, quota-aware ranking, and sanction order generation.

### 5. Deficiency Management
- Officers raise deficiencies; applicants resolve them from their dashboard with re-uploaded documents.
- Status lifecycle tracked on both sides with notifications.

### 6. Direct Benefit Transfer (Demo)
- Finance officer dashboard with batch disbursement runs.
- Synthetic RBI-style UTR generation (`RBI2026…`) on disbursement.
- Credit confirmation creates beneficiary notifications (simulated SMS + in-app).

### 7. Dynamic Scheme Rule Builder & Audit Trail
- No-code rule editor for scheme parameters (operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT IN`).
- Immutable-style audit log of sensitive state transitions with officer IDs and timestamps.

### 8. Application Tracking & Grievances
- Applicants track application status through the lifecycle.
- Grievance/helpdesk submission and tracking.
- In-app notification center.

### 9. Dashboard & Analytics
- Applicant dashboard (applications, deficiencies, documents, notifications).
- Admin dashboard with operational analytics across schemes, applications, and disbursals.
- Officer, selection committee, and finance dashboards.

### 10. Accessibility & Localization
- WCAG-oriented controls: font scaling (`A-`, `A`, `A+`), high-contrast/dark mode, reduced motion.
- Trilingual UI: English, Hindi, Marathi (`client/src/utils/translations.js`).
- Command palette (Ctrl+K) quick navigation.

---

## 👤 Applicant Workflow

1. **Register / Login** → applicant account with profile.
2. **Browse schemes** in the catalog (`/schemes`), optionally using the AI scheme finder.
3. **Apply** through the 10-step wizard (`/applicant/application/new`) with draft autosave.
4. **Upload documents** in the document manager; OCR extraction preview populates fields.
5. **Submit** → application enters officer scrutiny.
6. **Track** status on the dashboard (`/applicant/dashboard`) and application detail page.
7. **Resolve deficiencies** if officers raise any (`/applicant/deficiencies`).
8. **Receive notifications** on approval, selection, and disbursement.
9. **Raise grievances** if needed (`/applicant/help`).

## 🛡️ Officer / Admin Workflow

| Role | Work Area |
|---|---|
| `VERIFICATION_OFFICER` | Priority queues, side-by-side OCR scrutiny, verification decisions |
| `SCRUTINY_OFFICER` | Anomaly audits, deficiency orders |
| `SELECTION_COMMITTEE` | Candidate scoring, quotas, sanction orders (`/selection`) |
| `FINANCE_OFFICER` | DBT batch disbursals, UTR generation (`/finance`) |
| `ADMIN` / `SUPER_ADMIN` | Operations analytics, scheme rule engine, audit trail (`/admin/*`) |

---

## 🗄️ Repository Structure

```
TribalScholar AI/
├── client/                     # React 18 + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/common/  # Header, Footer, ProtectedRoute, CommandPalette
│   │   ├── context/            # AuthContext, AccessibilityContext, NotificationContext
│   │   ├── pages/              # 22 application pages
│   │   ├── services/api.js     # Axios client with JWT interceptor
│   │   ├── utils/              # Formatters & trilingual dictionaries
│   │   ├── App.jsx             # Route registry
│   │   └── main.jsx            # React root entrypoint
│   ├── index.html              # HTML shell, meta tags, favicon
│   ├── tailwind.config.js
│   ├── vite.config.js          # Dev server + /api proxy to :5000
│   └── vercel.json
│
├── server/                     # Node.js + Express API
│   ├── config/db.js            # Mongoose connection
│   ├── controllers/            # 10 controller modules
│   ├── middleware/             # JWT auth, role authorization, errors, uploads
│   ├── models/                 # 14 Mongoose schemas
│   ├── routes/                 # 12 REST route modules
│   ├── seed/seedRunner.js      # Demo data seeder
│   ├── services/               # Audit & notification services
│   │   └── ai/                 # OCR, eligibility, anomaly, classifier, deficiency
│   └── server.js               # Express bootstrap, /api/health
│
├── .env.example                # Environment template
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚙️ Technology Stack

**Frontend:** React 18, Vite 5, React Router 6, Tailwind CSS 3, Axios, Recharts, Lucide icons, clsx/tailwind-merge

**Backend:** Node.js, Express 4, Mongoose 8 (MongoDB), JSONwebtoken, bcryptjs, Helmet, CORS, Morgan, express-validator, express-rate-limit, Multer

**Database:** MongoDB (local `mongodb://127.0.0.1:27017/...` or Atlas)

**Tooling:** npm, concurrently, nodemon

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+ (npm included)
- MongoDB running on `127.0.0.1:27017`, **or** a MongoDB Atlas connection string

### 1. Install dependencies
```bash
npm run install:all
```
(installs root, `server/`, and `client/` in one go)

### 2. Configure environment variables
Create `server/.env` from the template:
```bash
copy .env.example server\.env     # Windows
# or: cp .env.example server/.env # macOS/Linux
```
Then edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tribal_scholar_ai
JWT_SECRET=<generate-a-long-random-secret>
AI_MODE=demo
OCR_MODE=demo
CLIENT_URL=http://localhost:5173
```

| Variable | Required | Notes |
|---|---|---|
| `PORT` | Yes | Backend port (default `5000`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes (production) | **Set your own random secret.** An insecure fallback exists in code for local demo only. |
| `AI_MODE` / `OCR_MODE` | No | Leave as `demo` — no external AI/OCR API keys are used by this codebase |
| `CLIENT_URL` | No | CORS origin for the frontend |
| `VITE_API_URL` | No | Frontend only; unset means same-origin `/api` (Vite dev proxy) |

> No third-party API keys, OAuth secrets, or paid service credentials are required to run this project in demo mode.

### 3. Seed demo data (recommended)
```bash
npm run seed
```
Creates demo users (applicants, officers, admin), 5 national ST schemes, applications, documents, deficiencies, selections, and disbursals.

**Demo accounts** (created by the seeder):

| Persona | Email | Password |
|---|---|---|
| Applicant Student | `applicant@demo.com` | `Demo@123` |
| Verification Officer | `verifier@demo.com` | `Demo@123` |
| Scrutiny Officer | `scrutiny@demo.com` | `Demo@123` |
| Selection Committee | `committee@demo.com` | `Demo@123` |
| Finance / DBT Officer | `finance@demo.com` | `Demo@123` |
| System Administrator | `admin@demo.com` | `Demo@123` |

There is also a one-click persona switcher at **`/demo`** (Judge Demo Hub) for evaluation walkthroughs.

### 4. Run both servers
```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

---

## 🛠️ Development Commands

| Command | Description |
|---|---|
| `npm run install:all` | Install root + server + client dependencies |
| `npm run dev` | Start backend and frontend concurrently |
| `npm run server` | Start backend only (`node server/server.js`) |
| `npm run client` | Start frontend only (Vite dev server) |
| `npm run seed` | Seed the database with demo data |

Server-side (inside `server/`): `npm run dev` (nodemon), `npm start` (production).

## 📦 Production Build

```bash
# 1. Build the frontend
cd client
npm run build          # outputs client/dist

# 2. Start the API in production mode
cd ../server
set NODE_ENV=production   # Windows
export NODE_ENV=production # macOS/Linux
npm start
```

Serve `client/dist` from any static host or reverse proxy, and proxy `/api` + `/uploads` to the API server (see `client/vercel.json` for a serverless routing example). Set `VITE_API_URL` at build time if the API is on a different origin.

---

## 🛡️ Security & Privacy Notes

- JWT-based authentication with role-based route authorization.
- SHA-256 file checksums for tamper/duplicate document detection.
- Masked Aadhaar display; synthetic demo data only (DPDP-aligned field design).
- Helmet security headers and CORS restrictions.

---

## ⚖️ License & Notice

Developed as an **SIH 2026** project by **Krishna R**.

This project is a independently maintained working copy. All candidate names, Aadhaar numbers, and bank account numbers in the seed/demo data are synthetic. No license file was present in the source material — add one before publishing publicly if you intend to grant specific usage rights.
